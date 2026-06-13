#!/usr/bin/env bash
#
# startup.sh - Start all EEM services (gs-monitor + monitor daemon)
# Run this after reboot or to bring everything up from scratch.
#
set -euo pipefail

APP_DIR="/opt/emergency-monitor"

echo "=== EEM Startup ==="
echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') Starting EEM services..."

# 1. Start gs-monitor
"${APP_DIR}/eem-service.sh" start

# 2. Start monitoring daemon
"${APP_DIR}/monitor-daemon.sh" start

# 3. Quick health verify
sleep 2
"${APP_DIR}/healthcheck.sh" && echo "=== EEM Startup Complete ===" || echo "=== WARNING: Health check failed after startup ==="
