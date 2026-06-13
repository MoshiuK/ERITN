"""Gunicorn configuration for EEM admin service."""
import multiprocessing

# Binding
bind = "0.0.0.0:5001"

# TLS
certfile = "/opt/emergency-monitor/tls/cert.pem"
keyfile = "/opt/emergency-monitor/tls/key.pem"

# Workers
workers = 2
worker_class = "sync"
timeout = 30
graceful_timeout = 10
keepalive = 5

# Logging
accesslog = "/opt/emergency-monitor/logs/access.log"
errorlog = "/opt/emergency-monitor/logs/error.log"
loglevel = "info"

# Process naming
proc_name = "gs-monitor"

# Security
limit_request_line = 8190
limit_request_fields = 100


# --- Self-healing hook ---
# On worker boot, start a background thread that ensures the monitor daemon
# stays alive. Only one worker does this (worker 0).
def post_worker_init(worker):
    """Ensure monitor daemon is running from inside gunicorn."""
    import threading
    import subprocess
    import time as _time

    def _ensure_monitor():
        _time.sleep(10)  # Let startup settle
        while True:
            try:
                subprocess.run(
                    ["/usr/local/bin/python3",
                     "/opt/emergency-monitor/monitor_daemon.py", "ensure"],
                    capture_output=True, timeout=15,
                )
            except Exception:
                pass
            _time.sleep(300)  # Check every 5 min

    t = threading.Thread(target=_ensure_monitor, daemon=True)
    t.start()
