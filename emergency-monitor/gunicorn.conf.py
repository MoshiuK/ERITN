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
