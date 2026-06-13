"""
EEM (Emergency Entry Monitor) Admin Service
Serves the emergency admin dashboard for ERITN.
"""
import os
import json
import logging
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__, static_folder="static")

# Configuration from environment
EEM_ADMIN_KEY = os.environ.get("EEM_ADMIN_KEY", "")
EEM_APK_URL = os.environ.get("EEM_APK_URL", "")
EEM_INVITE_CODE = os.environ.get("EEM_INVITE_CODE", "")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("eem")

# In-memory store for pending entries (placeholder for real DB)
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "entries.json")


def _ensure_data_dir():
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump([], f)


def _load_entries():
    _ensure_data_dir()
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def _save_entries(entries):
    _ensure_data_dir()
    with open(DATA_FILE, "w") as f:
        json.dump(entries, f, indent=2)


# --- Health endpoint (unauthenticated) ---
@app.route("/healthz")
def healthz():
    return jsonify({"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}), 200


# --- Admin dashboard ---
ADMIN_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EEM Admin - ERITN Emergency Monitor</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         margin: 0; padding: 20px; background: #f5f5f5; color: #333; }
  .container { max-width: 960px; margin: 0 auto; }
  h1 { color: #1a5276; border-bottom: 3px solid #2980b9; padding-bottom: 10px; }
  .status-bar { background: #2980b9; color: white; padding: 12px 20px; border-radius: 6px;
                 margin-bottom: 20px; display: flex; justify-content: space-between; }
  .status-bar .label { font-weight: bold; }
  .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
  .card h3 { margin-top: 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eee; }
  th { background: #ecf0f1; font-weight: 600; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.85em; }
  .badge-pending { background: #f39c12; color: white; }
  .badge-approved { background: #27ae60; color: white; }
  .badge-denied { background: #e74c3c; color: white; }
  .info-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
  .info-box { flex: 1; min-width: 200px; background: white; padding: 16px; border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.12); text-align: center; }
  .info-box .num { font-size: 2em; font-weight: bold; color: #2980b9; }
  .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;
         font-size: 0.9em; margin-right: 4px; }
  .btn-approve { background: #27ae60; color: white; }
  .btn-deny { background: #e74c3c; color: white; }
  .footer { margin-top: 30px; text-align: center; color: #888; font-size: 0.85em; }
</style>
</head>
<body>
<div class="container">
  <h1>ERITN Emergency Entry Monitor</h1>
  <div class="status-bar">
    <span><span class="label">Filter:</span> {{ status_filter }}</span>
    <span><span class="label">Server Time:</span> {{ server_time }}</span>
  </div>
  <div class="info-row">
    <div class="info-box">
      <div class="num">{{ counts.pending }}</div>
      <div>Pending</div>
    </div>
    <div class="info-box">
      <div class="num">{{ counts.approved }}</div>
      <div>Approved</div>
    </div>
    <div class="info-box">
      <div class="num">{{ counts.denied }}</div>
      <div>Denied</div>
    </div>
    <div class="info-box">
      <div class="num">{{ counts.total }}</div>
      <div>Total</div>
    </div>
  </div>
  <div class="card">
    <h3>Entries ({{ status_filter }})</h3>
    {% if entries %}
    <table>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Status</th><th>Submitted</th><th>Actions</th></tr>
      </thead>
      <tbody>
      {% for e in entries %}
        <tr>
          <td>{{ e.id }}</td>
          <td>{{ e.name }}</td>
          <td><span class="badge badge-{{ e.status }}">{{ e.status }}</span></td>
          <td>{{ e.submitted }}</td>
          <td>
            {% if e.status == 'pending' %}
            <form method="POST" action="/eem/admin/action" style="display:inline">
              <input type="hidden" name="key" value="{{ admin_key }}">
              <input type="hidden" name="entry_id" value="{{ e.id }}">
              <button name="action" value="approve" class="btn btn-approve">Approve</button>
              <button name="action" value="deny" class="btn btn-deny">Deny</button>
            </form>
            {% else %}
            &mdash;
            {% endif %}
          </td>
        </tr>
      {% endfor %}
      </tbody>
    </table>
    {% else %}
    <p style="color:#888;">No entries match this filter.</p>
    {% endif %}
  </div>
  <div class="card">
    <h3>App Distribution</h3>
    <p><strong>APK Download:</strong> <a href="{{ apk_url }}">{{ apk_url }}</a></p>
    <p><strong>Invite Code:</strong> <code>{{ invite_code }}</code></p>
  </div>
  <div class="footer">
    EEM Admin &bull; ERITN Emergency Monitor &bull; TruEntry Platform
  </div>
</div>
</body>
</html>
"""


@app.route("/eem/admin")
def eem_admin():
    key = request.args.get("key", "")
    if not key or key != EEM_ADMIN_KEY:
        logger.warning("Unauthorized admin access attempt from %s", request.remote_addr)
        return jsonify({"error": "unauthorized"}), 403

    status_filter = request.args.get("status", "pending")
    entries = _load_entries()

    if status_filter != "all":
        filtered = [e for e in entries if e.get("status") == status_filter]
    else:
        filtered = entries

    counts = {
        "pending": sum(1 for e in entries if e.get("status") == "pending"),
        "approved": sum(1 for e in entries if e.get("status") == "approved"),
        "denied": sum(1 for e in entries if e.get("status") == "denied"),
        "total": len(entries),
    }

    logger.info("Admin dashboard accessed: filter=%s entries=%d", status_filter, len(filtered))

    return render_template_string(
        ADMIN_TEMPLATE,
        entries=filtered,
        status_filter=status_filter,
        counts=counts,
        server_time=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        admin_key=EEM_ADMIN_KEY,
        apk_url=EEM_APK_URL,
        invite_code=EEM_INVITE_CODE,
    )


@app.route("/eem/admin/action", methods=["POST"])
def eem_admin_action():
    key = request.form.get("key", "")
    if not key or key != EEM_ADMIN_KEY:
        return jsonify({"error": "unauthorized"}), 403

    entry_id = request.form.get("entry_id", "")
    action = request.form.get("action", "")

    if action not in ("approve", "deny"):
        return jsonify({"error": "invalid action"}), 400

    entries = _load_entries()
    found = False
    for e in entries:
        if str(e.get("id")) == str(entry_id):
            e["status"] = "approved" if action == "approve" else "denied"
            e["actioned_at"] = datetime.now(timezone.utc).isoformat()
            found = True
            break

    if not found:
        return jsonify({"error": "entry not found"}), 404

    _save_entries(entries)
    logger.info("Entry %s %sd", entry_id, action)

    # Redirect back to pending view
    from flask import redirect
    return redirect(f"/eem/admin?status=pending&key={EEM_ADMIN_KEY}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
