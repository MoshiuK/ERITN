#!/usr/bin/env bash
#
# eem-service.sh - Service manager for EEM (gs-monitor)
# Usage: eem-service.sh {start|stop|restart|status}
#
set -euo pipefail

APP_DIR="/opt/emergency-monitor"
PID_FILE="${APP_DIR}/gs-monitor.pid"
LOG_DIR="${APP_DIR}/logs"
GUNICORN_BIN="/usr/local/bin/gunicorn"

# Required environment
export EEM_ADMIN_KEY="KMGI-EEM-ADMIN"
export EEM_APK_URL="https://emergency.eritn.com/static/eem/app-release.apk"
export EEM_INVITE_CODE="ERITN2026"

mkdir -p "${LOG_DIR}" "${APP_DIR}/data"

is_running() {
    if [ -f "${PID_FILE}" ]; then
        local pid
        pid=$(cat "${PID_FILE}")
        if kill -0 "${pid}" 2>/dev/null; then
            return 0
        fi
        # Stale PID file
        rm -f "${PID_FILE}"
    fi
    return 1
}

get_pid() {
    if [ -f "${PID_FILE}" ]; then
        cat "${PID_FILE}"
    fi
}

do_start() {
    if is_running; then
        echo "[INFO] gs-monitor already running (PID $(get_pid))"
        return 0
    fi

    # Kill any orphan gunicorn processes on port 5001
    local orphans
    orphans=$(pgrep -f "gunicorn.*wsgi.*5001" 2>/dev/null || true)
    if [ -n "${orphans}" ]; then
        echo "[WARN] Killing orphan gunicorn processes: ${orphans}"
        echo "${orphans}" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi

    echo "[INFO] Starting gs-monitor..."
    cd "${APP_DIR}"
    ${GUNICORN_BIN} wsgi:app \
        --config gunicorn.conf.py \
        --pid "${PID_FILE}" \
        --daemon \
        2>&1

    sleep 2

    if is_running; then
        echo "[OK] gs-monitor started (PID $(get_pid))"
    else
        echo "[ERROR] gs-monitor failed to start. Check ${LOG_DIR}/error.log"
        return 1
    fi
}

do_stop() {
    if ! is_running; then
        echo "[INFO] gs-monitor is not running"
        rm -f "${PID_FILE}"
        return 0
    fi

    local pid
    pid=$(get_pid)
    echo "[INFO] Stopping gs-monitor (PID ${pid})..."

    # Graceful shutdown
    kill -TERM "${pid}" 2>/dev/null || true
    local count=0
    while kill -0 "${pid}" 2>/dev/null && [ ${count} -lt 10 ]; do
        sleep 1
        count=$((count + 1))
    done

    # Force kill if still running
    if kill -0 "${pid}" 2>/dev/null; then
        echo "[WARN] Forcing kill..."
        kill -9 "${pid}" 2>/dev/null || true
        sleep 1
    fi

    rm -f "${PID_FILE}"
    echo "[OK] gs-monitor stopped"
}

do_status() {
    if is_running; then
        local pid
        pid=$(get_pid)
        echo "[OK] gs-monitor is running (PID ${pid})"
        # Show worker processes
        pgrep -P "${pid}" 2>/dev/null | while read -r wpid; do
            echo "  worker PID: ${wpid}"
        done
        return 0
    else
        echo "[DOWN] gs-monitor is NOT running"
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
