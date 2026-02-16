# EEM Uptime Runbook

**Service**: gs-monitor (EEM Emergency Admin Endpoint)
**Host**: VPS 155.138.232.166
**Endpoint**: `https://emergency.eritn.com/eem/admin?status=pending&key=KMGI-EEM-ADMIN`
**App Path**: `/opt/emergency-monitor`
**Port**: 5001 (HTTPS/TLS)
**Priority**: P1 (responder-critical)

---

## Quick Reference

| Item | Value |
|------|-------|
| Service name | gs-monitor |
| Port | 5001 |
| PID file | `/opt/emergency-monitor/gs-monitor.pid` |
| TLS cert | `/opt/emergency-monitor/tls/cert.pem` |
| TLS key | `/opt/emergency-monitor/tls/key.pem` |
| Healthcheck log | `/opt/emergency-monitor/logs/healthcheck.log` |
| Access log | `/opt/emergency-monitor/logs/access.log` |
| Error log | `/opt/emergency-monitor/logs/error.log` |
| Monitor daemon log | `/opt/emergency-monitor/logs/monitor-daemon.log` |
| Monitor interval | 2 minutes |

---

## Check Commands

### 1. Service status
```bash
/opt/emergency-monitor/eem-service.sh status
```

### 2. Monitor daemon status
```bash
/opt/emergency-monitor/monitor-daemon.sh status
```

### 3. Check port binding
```bash
ss -ltnp | grep :5001
# or if ss is unavailable:
netstat -tlnp | grep :5001
```

### 4. Test health endpoint
```bash
curl -sk https://localhost:5001/healthz
```

### 5. Test admin endpoint
```bash
curl -sk -o /dev/null -w "%{http_code}\n" \
  "https://localhost:5001/eem/admin?status=pending&key=KMGI-EEM-ADMIN"
```

### 6. Test from outside (with DNS)
```bash
curl -I "https://emergency.eritn.com/eem/admin?status=pending&key=KMGI-EEM-ADMIN"
```

### 7. View recent healthcheck results
```bash
tail -20 /opt/emergency-monitor/logs/healthcheck.log
```

### 8. View recent errors
```bash
tail -50 /opt/emergency-monitor/logs/error.log
```

### 9. Check process tree
```bash
ps aux | grep gunicorn
```

---

## Restart Commands

### Restart service only
```bash
/opt/emergency-monitor/eem-service.sh restart
```

### Restart everything (service + monitor)
```bash
/opt/emergency-monitor/eem-service.sh restart
/opt/emergency-monitor/monitor-daemon.sh restart
```

### Full cold start (after reboot or total failure)
```bash
/opt/emergency-monitor/startup.sh
```

### Force kill and restart (last resort)
```bash
pkill -9 -f "gunicorn.*wsgi"
rm -f /opt/emergency-monitor/gs-monitor.pid
sleep 2
/opt/emergency-monitor/eem-service.sh start
```

---

## TLS Verify Commands

### Check certificate subject and SAN
```bash
openssl x509 -in /opt/emergency-monitor/tls/cert.pem -noout -subject -ext subjectAltName
```

### Check certificate expiration
```bash
openssl x509 -in /opt/emergency-monitor/tls/cert.pem -noout -dates
```

### Verify TLS from the live endpoint
```bash
openssl s_client -connect localhost:5001 -servername emergency.eritn.com < /dev/null 2>/dev/null \
  | openssl x509 -noout -subject -ext subjectAltName
```

### Check from outside
```bash
echo | openssl s_client -connect emergency.eritn.com:5001 -servername emergency.eritn.com 2>/dev/null \
  | openssl x509 -noout -subject -dates -ext subjectAltName
```

---

## Rollback Steps

If a deployment or configuration change causes issues:

### 1. Stop the broken service
```bash
/opt/emergency-monitor/eem-service.sh stop
```

### 2. Restore previous app.py (if backed up)
```bash
# Backups are at /opt/emergency-monitor/backups/ (if created before change)
cp /opt/emergency-monitor/backups/app.py.bak /opt/emergency-monitor/app.py
```

### 3. Restore previous gunicorn config
```bash
cp /opt/emergency-monitor/backups/gunicorn.conf.py.bak /opt/emergency-monitor/gunicorn.conf.py
```

### 4. Restart
```bash
/opt/emergency-monitor/eem-service.sh start
```

### 5. Verify
```bash
/opt/emergency-monitor/healthcheck.sh
```

### Creating backups before changes
```bash
mkdir -p /opt/emergency-monitor/backups
cp /opt/emergency-monitor/app.py /opt/emergency-monitor/backups/app.py.bak
cp /opt/emergency-monitor/gunicorn.conf.py /opt/emergency-monitor/backups/gunicorn.conf.py.bak
cp /opt/emergency-monitor/tls/cert.pem /opt/emergency-monitor/backups/cert.pem.bak
cp /opt/emergency-monitor/tls/key.pem /opt/emergency-monitor/backups/key.pem.bak
```

---

## Environment Variables

These must be set for the service to function. They are hardcoded in `eem-service.sh` and `env.conf`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `EEM_ADMIN_KEY` | `KMGI-EEM-ADMIN` | Admin dashboard auth key |
| `EEM_APK_URL` | `https://emergency.eritn.com/static/eem/app-release.apk` | APK download URL |
| `EEM_INVITE_CODE` | `ERITN2026` | Mobile app invite code |

To change, edit `/opt/emergency-monitor/env.conf` and `/opt/emergency-monitor/eem-service.sh`, then restart.

---

## Troubleshooting

### Service won't start
1. Check port conflict: `netstat -tlnp | grep :5001` or `lsof -i :5001`
2. Check TLS cert: `openssl x509 -in /opt/emergency-monitor/tls/cert.pem -noout -dates`
3. Check Python/gunicorn: `python3 -c "import flask; print(flask.__version__)"`
4. Check error log: `tail -50 /opt/emergency-monitor/logs/error.log`

### 403 on admin endpoint
- Verify the `key` parameter matches `EEM_ADMIN_KEY`
- URL must be: `/eem/admin?status=pending&key=KMGI-EEM-ADMIN`

### TLS errors / certificate mismatch
1. Verify cert CN/SAN: `openssl x509 -in /opt/emergency-monitor/tls/cert.pem -noout -subject -ext subjectAltName`
2. Regenerate if needed:
   ```bash
   openssl req -x509 -newkey rsa:2048 \
     -keyout /opt/emergency-monitor/tls/key.pem \
     -out /opt/emergency-monitor/tls/cert.pem \
     -days 365 -nodes \
     -subj "/CN=emergency.eritn.com" \
     -addext "subjectAltName=DNS:emergency.eritn.com"
   chmod 600 /opt/emergency-monitor/tls/key.pem
   /opt/emergency-monitor/eem-service.sh restart
   ```

### Monitor daemon not running
```bash
/opt/emergency-monitor/monitor-daemon.sh start
```

---

## File Layout

```
/opt/emergency-monitor/
  app.py                 # Flask application
  wsgi.py                # WSGI entry point
  gunicorn.conf.py       # Gunicorn configuration
  eem-service.sh         # Service start/stop/restart/status
  healthcheck.sh         # Health check + auto-recovery
  monitor-daemon.sh      # Background monitoring (runs healthcheck every 2 min)
  startup.sh             # Cold start script (starts service + monitor)
  env.conf               # Environment variable config
  gs-monitor.pid         # Service PID file
  monitor-daemon.pid     # Monitor daemon PID file
  UPTIME_RUNBOOK.md      # This file
  tls/
    cert.pem             # TLS certificate
    key.pem              # TLS private key
  data/
    entries.json         # Entry data store
  logs/
    access.log           # Gunicorn access log
    error.log            # Gunicorn error log
    healthcheck.log      # Health check results
    monitor-daemon.log   # Monitor daemon log
```
