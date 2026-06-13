#!/usr/bin/env bash
#
# monitor-daemon.sh - Wrapper for Python monitoring daemon
# Usage: monitor-daemon.sh {start|stop|restart|status}
#
exec /usr/local/bin/python3 /opt/emergency-monitor/monitor_daemon.py "$@"
