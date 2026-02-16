#!/usr/bin/env bash
#
# monitor-daemon.sh - Background monitoring daemon for gs-monitor
# Runs healthcheck every 2 minutes, logs results
# Usage: monitor-daemon.sh {start|stop|status}
#

APP_DIR="/opt/emergency-monitor"
PID_FILE="${APP_DIR}/monitor-daemon.pid"
LOG_FILE="${APP_DIR}/logs/monitor-daemon.log"
INTERVAL=120  # 2 minutes

mkdir -p "${APP_DIR}/logs"

log() {
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') [monitor] $*" >> "${LOG_FILE}"
}

is_running() {
    if [ -f "${PID_FILE}" ]; then
        local pid
        pid=$(cat "${PID_FILE}" 2>/dev/null)
        if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
            return 0
        fi
        rm -f "${PID_FILE}"
    fi
    return 1
}

do_start() {
    if is_running; then
        echo "[INFO] Monitor daemon already running (PID $(cat "${PID_FILE}"))"
        return 0
    fi
    echo "[INFO] Starting monitor daemon..."

    # Launch as a separate nohup process
    nohup bash -c '
        APP_DIR="/opt/emergency-monitor"
        PID_FILE="${APP_DIR}/monitor-daemon.pid"
        LOG_FILE="${APP_DIR}/logs/monitor-daemon.log"
        INTERVAL=120

        echo $$ > "${PID_FILE}"
        echo "$(date -u "+%Y-%m-%dT%H:%M:%SZ") [monitor] Daemon started (PID $$, interval=${INTERVAL}s)" >> "${LOG_FILE}"

        while true; do
            # Rotate log if > 10MB
            size=$(stat -c%s "${LOG_FILE}" 2>/dev/null || echo 0)
            if [ "${size}" -gt 10485760 ]; then
                mv "${LOG_FILE}" "${LOG_FILE}.old"
                echo "$(date -u "+%Y-%m-%dT%H:%M:%SZ") [monitor] Log rotated" >> "${LOG_FILE}"
            fi
            "${APP_DIR}/healthcheck.sh" 2>&1 || true
            sleep ${INTERVAL}
        done
    ' >> "${LOG_FILE}" 2>&1 &
    disown

    sleep 2
    if is_running; then
        echo "[OK] Monitor daemon started (PID $(cat "${PID_FILE}"))"
    else
        echo "[ERROR] Monitor daemon failed to start"
        return 1
    fi
}

do_stop() {
    if ! is_running; then
        echo "[INFO] Monitor daemon is not running"
        return 0
    fi
    local pid
    pid=$(cat "${PID_FILE}")
    kill "${pid}" 2>/dev/null || true
    rm -f "${PID_FILE}"
    echo "[OK] Monitor daemon stopped (was PID ${pid})"
}

do_status() {
    if is_running; then
        echo "[OK] Monitor daemon is running (PID $(cat "${PID_FILE}"))"
        echo "Last 5 healthcheck log entries:"
        tail -5 "${APP_DIR}/logs/healthcheck.log" 2>/dev/null || echo "  (no log entries yet)"
    else
        echo "[DOWN] Monitor daemon is NOT running"
        return 1
    fi
}

case "${1:-}" in
    start)   do_start ;;
    stop)    do_stop ;;
    restart) do_stop; sleep 1; do_start ;;
    status)  do_status ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
