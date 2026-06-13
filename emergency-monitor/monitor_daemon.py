#!/usr/bin/env python3
"""
monitor_daemon.py - Persistent monitoring daemon for gs-monitor.
Runs healthcheck every 2 minutes with proper daemonization.

Architecture:
- Double-fork daemon with aggressive crash protection
- Main loop catches ALL exceptions to prevent silent death
- healthcheck.sh calls 'ensure' to auto-restart this daemon if dead

Usage: monitor_daemon.py {start|stop|restart|status|ensure}
"""
import os
import sys
import time
import signal
import subprocess
import atexit
import traceback
from datetime import datetime, timezone

APP_DIR = "/opt/emergency-monitor"
PID_FILE = os.path.join(APP_DIR, "monitor-daemon.pid")
LOG_FILE = os.path.join(APP_DIR, "logs", "monitor-daemon.log")
HEALTHCHECK = os.path.join(APP_DIR, "healthcheck.sh")
INTERVAL = 120  # seconds
MAX_LOG_SIZE = 10 * 1024 * 1024  # 10 MB


def log(msg):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"{ts} [monitor] {msg}\n"
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a") as f:
            f.write(line)
    except OSError:
        pass


def read_pid():
    try:
        with open(PID_FILE, "r") as f:
            content = f.read().strip()
            return int(content) if content else None
    except (FileNotFoundError, ValueError):
        return None


def write_pid(pid):
    with open(PID_FILE, "w") as f:
        f.write(str(pid) + "\n")


def remove_pid():
    try:
        os.remove(PID_FILE)
    except FileNotFoundError:
        pass


def is_running():
    pid = read_pid()
    if pid is None:
        return False
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        remove_pid()
        return False


def rotate_log():
    try:
        if os.path.exists(LOG_FILE) and os.path.getsize(LOG_FILE) > MAX_LOG_SIZE:
            old = LOG_FILE + ".old"
            if os.path.exists(old):
                os.remove(old)
            os.rename(LOG_FILE, old)
            log("Log rotated")
    except OSError:
        pass


def daemonize():
    """Double-fork to fully detach from terminal/session."""
    try:
        pid = os.fork()
        if pid > 0:
            sys.exit(0)
    except OSError as e:
        log(f"Fork #1 failed: {e}")
        sys.exit(1)

    os.chdir(APP_DIR)
    os.setsid()
    os.umask(0o022)

    try:
        pid = os.fork()
        if pid > 0:
            sys.exit(0)
    except OSError as e:
        log(f"Fork #2 failed: {e}")
        sys.exit(1)

    # Redirect stdio to /dev/null
    sys.stdout.flush()
    sys.stderr.flush()
    devnull = os.open(os.devnull, os.O_RDWR)
    os.dup2(devnull, 0)
    os.dup2(devnull, 1)
    os.dup2(devnull, 2)
    os.close(devnull)


def run_healthcheck():
    try:
        result = subprocess.run(
            ["/usr/bin/env", "bash", HEALTHCHECK, "--no-ensure"],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=APP_DIR,
        )
        return result.returncode
    except subprocess.TimeoutExpired:
        log("ERROR: healthcheck.sh timed out after 60s")
        return 1
    except Exception as e:
        log(f"ERROR: healthcheck exception: {e}")
        return 1


def main_loop():
    write_pid(os.getpid())
    atexit.register(remove_pid)

    # Ignore SIGHUP so we survive terminal close
    signal.signal(signal.SIGHUP, signal.SIG_IGN)

    def handle_term(signum, frame):
        log(f"Received signal {signum}, shutting down")
        remove_pid()
        sys.exit(0)

    signal.signal(signal.SIGTERM, handle_term)
    signal.signal(signal.SIGINT, handle_term)

    log(f"Daemon started (PID {os.getpid()}, interval={INTERVAL}s)")

    consecutive_errors = 0
    while True:
        try:
            rotate_log()
            rc = run_healthcheck()
            if rc == 0:
                consecutive_errors = 0
            else:
                consecutive_errors += 1
                log(f"Healthcheck returned {rc} (consecutive errors: {consecutive_errors})")
        except Exception as e:
            consecutive_errors += 1
            log(f"LOOP ERROR: {e}\n{traceback.format_exc()}")

        try:
            time.sleep(INTERVAL)
        except Exception:
            # Even sleep can fail if signals arrive; just continue
            pass


def do_start(quiet=False):
    if is_running():
        pid = read_pid()
        if not quiet:
            print(f"[INFO] Monitor daemon already running (PID {pid})")
        return

    if not quiet:
        print("[INFO] Starting monitor daemon...")
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

    daemonize()
    main_loop()


def do_stop():
    if not is_running():
        print("[INFO] Monitor daemon is not running")
        remove_pid()
        return

    pid = read_pid()
    print(f"[INFO] Stopping monitor daemon (PID {pid})...")
    try:
        os.kill(pid, signal.SIGTERM)
        for _ in range(50):
            time.sleep(0.1)
            try:
                os.kill(pid, 0)
            except OSError:
                break
        else:
            os.kill(pid, signal.SIGKILL)
    except OSError:
        pass
    remove_pid()
    print(f"[OK] Monitor daemon stopped (was PID {pid})")


def do_status():
    if is_running():
        pid = read_pid()
        print(f"[OK] Monitor daemon is running (PID {pid})")
        print("Last 5 healthcheck log entries:")
        try:
            hc_log = os.path.join(APP_DIR, "logs", "healthcheck.log")
            with open(hc_log, "r") as f:
                lines = f.readlines()
            for line in lines[-5:]:
                print(f"  {line.rstrip()}")
        except FileNotFoundError:
            print("  (no log entries yet)")
    else:
        print("[DOWN] Monitor daemon is NOT running")
        sys.exit(1)


def do_ensure():
    """Silently start daemon if not running. Called by healthcheck.sh."""
    if not is_running():
        log("ensure: daemon was dead, restarting")
        do_start(quiet=True)


if __name__ == "__main__":
    cmds = ("start", "stop", "restart", "status", "ensure")
    if len(sys.argv) < 2 or sys.argv[1] not in cmds:
        print(f"Usage: {sys.argv[0]} {{{','.join(cmds)}}}")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "start":
        do_start()
    elif cmd == "stop":
        do_stop()
    elif cmd == "restart":
        do_stop()
        time.sleep(1)
        do_start()
    elif cmd == "status":
        do_status()
    elif cmd == "ensure":
        do_ensure()
