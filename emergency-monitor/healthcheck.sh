#!/usr/bin/env bash
#
# healthcheck.sh - Health check + auto-recovery for gs-monitor
#
# Checks the /healthz endpoint. If not HTTP 200, restarts the service
# and re-checks. Logs all actions to /opt/emergency-monitor/logs/healthcheck.log
#
set -u

APP_DIR="/opt/emergency-monitor"
LOG_FILE="${APP_DIR}/logs/healthcheck.log"
ENDPOINT="https://localhost:5001/healthz"
ADMIN_ENDPOINT="https://localhost:5001/eem/admin?status=pending&key=KMGI-EEM-ADMIN"
MAX_RETRIES=2
CURL_TIMEOUT=10
NO_ENSURE="${1:-}"

mkdir -p "${APP_DIR}/logs"

# Unless called with --no-ensure (from daemon), ensure monitor daemon is alive.
# This creates a self-healing loop: any manual healthcheck call will also
# revive the monitoring daemon if it died.
if [ "${NO_ENSURE}" != "--no-ensure" ]; then
    /usr/local/bin/python3 "${APP_DIR}/monitor_daemon.py" ensure 2>/dev/null &
fi

log() {
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') $*" >> "${LOG_FILE}"
}

check_health() {
    local http_code
    http_code=$(curl -sk -o /dev/null -w "%{http_code}" \
        --max-time ${CURL_TIMEOUT} \
        "${ENDPOINT}" 2>/dev/null || echo "000")
    echo "${http_code}"
}

check_admin() {
    local http_code
    http_code=$(curl -sk -o /dev/null -w "%{http_code}" \
        --max-time ${CURL_TIMEOUT} \
        "${ADMIN_ENDPOINT}" 2>/dev/null || echo "000")
    echo "${http_code}"
}

do_restart() {
    log "ACTION: Restarting gs-monitor..."
    "${APP_DIR}/eem-service.sh" restart >> "${LOG_FILE}" 2>&1
    sleep 3
}

# --- Main ---
health_code=$(check_health)

if [ "${health_code}" = "200" ]; then
    # Also verify admin endpoint
    admin_code=$(check_admin)
    if [ "${admin_code}" = "200" ]; then
        log "OK: healthz=${health_code} admin=${admin_code}"
        exit 0
    else
        log "WARN: healthz OK but admin endpoint returned ${admin_code}"
    fi
else
    log "FAIL: healthz returned ${health_code}"
fi

# Health check failed - attempt recovery
for attempt in $(seq 1 ${MAX_RETRIES}); do
    log "RECOVERY: Attempt ${attempt}/${MAX_RETRIES}"
    do_restart

    health_code=$(check_health)
    admin_code=$(check_admin)

    if [ "${health_code}" = "200" ] && [ "${admin_code}" = "200" ]; then
        log "RECOVERED: healthz=${health_code} admin=${admin_code} (attempt ${attempt})"
        exit 0
    else
        log "STILL_DOWN: healthz=${health_code} admin=${admin_code} (attempt ${attempt})"
    fi
done

log "CRITICAL: gs-monitor failed to recover after ${MAX_RETRIES} attempts. Manual intervention required."
exit 1
