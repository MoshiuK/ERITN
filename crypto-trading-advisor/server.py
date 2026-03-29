#!/usr/bin/env python3
"""
Crypto Trading Advisor - Backend Server
Provides live market data, signal storage, and portfolio tracking.
"""

import http.server
import json
import os
import sqlite3
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path(__file__).parent / "trading.db"
STATIC_DIR = Path(__file__).parent
PORT = 8080

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Top coins to track
TRACKED_COINS = [
    "bitcoin", "ethereum", "binancecoin", "solana", "cardano",
    "ripple", "polkadot", "avalanche-2", "chainlink", "polygon"
]


def init_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS signals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coin TEXT NOT NULL,
            direction TEXT NOT NULL CHECK(direction IN ('LONG','SHORT')),
            entry_price REAL NOT NULL,
            target_price REAL,
            stop_loss REAL,
            status TEXT DEFAULT 'OPEN' CHECK(status IN ('OPEN','CLOSED','CANCELLED')),
            exit_price REAL,
            pnl_percent REAL,
            notes TEXT,
            source TEXT DEFAULT 'manual',
            created_at TEXT DEFAULT (datetime('now')),
            closed_at TEXT
        );

        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coin TEXT NOT NULL,
            amount REAL NOT NULL,
            buy_price REAL NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS daily_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            starting_balance REAL NOT NULL,
            ending_balance REAL NOT NULL,
            daily_return_pct REAL NOT NULL,
            cumulative_return_pct REAL,
            notes TEXT
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    """)
    # Set default starting balance if not exists
    c.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('starting_balance', '1000')")
    c.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('daily_target', '1.25')")
    conn.commit()
    return conn


def fetch_market_data():
    """Fetch current prices and 24h data from CoinGecko."""
    ids = ",".join(TRACKED_COINS)
    url = (f"{COINGECKO_BASE}/coins/markets?vs_currency=usd&ids={ids}"
           f"&order=market_cap_desc&sparkline=false"
           f"&price_change_percentage=1h,24h,7d")
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"Market data fetch error: {e}")
        return []


def fetch_coin_history(coin_id, days=30):
    """Fetch price history for technical analysis."""
    url = f"{COINGECKO_BASE}/coins/{coin_id}/market_chart?vs_currency=usd&days={days}"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"History fetch error: {e}")
        return {"prices": []}


def calculate_rsi(prices, period=14):
    """Calculate RSI from price list."""
    if len(prices) < period + 1:
        return 50.0
    deltas = [prices[i] - prices[i - 1] for i in range(1, len(prices))]
    gains = [d if d > 0 else 0 for d in deltas[-period:]]
    losses = [-d if d < 0 else 0 for d in deltas[-period:]]
    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def calculate_sma(prices, period):
    """Simple moving average."""
    if len(prices) < period:
        return prices[-1] if prices else 0
    return sum(prices[-period:]) / period


def generate_advice(coin_id):
    """Generate trading advice based on technical indicators."""
    history = fetch_coin_history(coin_id, days=30)
    prices_raw = history.get("prices", [])
    if not prices_raw:
        return {"coin": coin_id, "advice": "Unable to fetch data", "confidence": "low"}

    prices = [p[1] for p in prices_raw]
    current = prices[-1]

    rsi = calculate_rsi(prices)
    sma7 = calculate_sma(prices, 7)
    sma20 = calculate_sma(prices, 20)

    signals = []
    direction = "HOLD"
    confidence = "medium"
    reasons = []

    # RSI analysis
    if rsi < 30:
        signals.append(1)
        reasons.append(f"RSI oversold ({rsi:.1f})")
    elif rsi > 70:
        signals.append(-1)
        reasons.append(f"RSI overbought ({rsi:.1f})")
    else:
        signals.append(0)
        reasons.append(f"RSI neutral ({rsi:.1f})")

    # Moving average crossover
    if sma7 > sma20:
        signals.append(1)
        reasons.append("7-day MA above 20-day MA (bullish)")
    else:
        signals.append(-1)
        reasons.append("7-day MA below 20-day MA (bearish)")

    # Price vs SMA20
    if current > sma20 * 1.05:
        signals.append(-0.5)
        reasons.append(f"Price {((current/sma20 - 1)*100):.1f}% above 20-day avg")
    elif current < sma20 * 0.95:
        signals.append(0.5)
        reasons.append(f"Price {((1 - current/sma20)*100):.1f}% below 20-day avg")

    # Trend (last 7 days)
    week_ago = prices[-7] if len(prices) >= 7 else prices[0]
    weekly_change = (current - week_ago) / week_ago * 100
    if weekly_change > 5:
        reasons.append(f"Strong uptrend this week (+{weekly_change:.1f}%)")
    elif weekly_change < -5:
        reasons.append(f"Strong downtrend this week ({weekly_change:.1f}%)")

    score = sum(signals) / len(signals) if signals else 0

    if score > 0.3:
        direction = "BUY"
        confidence = "high" if score > 0.6 else "medium"
    elif score < -0.3:
        direction = "SELL"
        confidence = "high" if score < -0.6 else "medium"

    # Suggested entry/target/stop for compounding
    if direction == "BUY":
        entry = current
        target = current * 1.0125  # 1.25% target
        stop = current * 0.99  # 1% stop loss
    elif direction == "SELL":
        entry = current
        target = current * 0.9875
        stop = current * 1.01
    else:
        entry = current
        target = current * 1.0125
        stop = current * 0.99

    return {
        "coin": coin_id,
        "current_price": round(current, 2),
        "direction": direction,
        "confidence": confidence,
        "rsi": round(rsi, 1),
        "sma7": round(sma7, 2),
        "sma20": round(sma20, 2),
        "weekly_change": round(weekly_change, 2),
        "reasons": reasons,
        "suggested_entry": round(entry, 2),
        "suggested_target": round(target, 2),
        "suggested_stop": round(stop, 2),
        "risk_reward": "1:1.25"
    }


class TradingHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if path == "/api/market":
            self._json_response(fetch_market_data())

        elif path == "/api/advice":
            coin = params.get("coin", ["bitcoin"])[0]
            self._json_response(generate_advice(coin))

        elif path == "/api/advice/all":
            top_coins = ["bitcoin", "ethereum", "solana", "binancecoin", "cardano"]
            results = []
            for coin in top_coins:
                try:
                    results.append(generate_advice(coin))
                except Exception:
                    pass
            self._json_response(results)

        elif path == "/api/signals":
            conn = sqlite3.connect(str(DB_PATH))
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM signals ORDER BY created_at DESC LIMIT 50"
            ).fetchall()
            self._json_response([dict(r) for r in rows])
            conn.close()

        elif path == "/api/compound":
            balance = float(params.get("balance", ["1000"])[0])
            rate = float(params.get("rate", ["1.25"])[0])
            days = int(params.get("days", ["365"])[0])
            projection = []
            b = balance
            for d in range(1, days + 1):
                b *= (1 + rate / 100)
                projection.append({
                    "day": d,
                    "balance": round(b, 2),
                    "profit": round(b - balance, 2),
                    "total_return_pct": round((b / balance - 1) * 100, 2)
                })
            self._json_response({
                "starting_balance": balance,
                "daily_rate": rate,
                "days": days,
                "final_balance": round(b, 2),
                "total_profit": round(b - balance, 2),
                "total_return_pct": round((b / balance - 1) * 100, 2),
                "projection": projection
            })

        elif path == "/api/daily-log":
            conn = sqlite3.connect(str(DB_PATH))
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM daily_log ORDER BY date DESC LIMIT 90"
            ).fetchall()
            self._json_response([dict(r) for r in rows])
            conn.close()

        elif path == "/api/settings":
            conn = sqlite3.connect(str(DB_PATH))
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM settings").fetchall()
            self._json_response({r["key"]: r["value"] for r in rows})
            conn.close()

        else:
            if path == "/" or path == "":
                self.path = "/index.html"
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        data = json.loads(body) if body else {}
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        conn = sqlite3.connect(str(DB_PATH))
        conn.row_factory = sqlite3.Row

        if path == "/api/signals":
            c = conn.execute(
                """INSERT INTO signals (coin, direction, entry_price, target_price,
                   stop_loss, notes, source)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (data["coin"], data["direction"], data["entry_price"],
                 data.get("target_price"), data.get("stop_loss"),
                 data.get("notes", ""), data.get("source", "manual"))
            )
            conn.commit()
            self._json_response({"id": c.lastrowid, "status": "created"})

        elif path == "/api/signals/close":
            signal_id = data["id"]
            exit_price = data["exit_price"]
            row = conn.execute("SELECT * FROM signals WHERE id = ?", (signal_id,)).fetchone()
            if row:
                entry = row["entry_price"]
                direction = row["direction"]
                if direction == "LONG":
                    pnl = (exit_price - entry) / entry * 100
                else:
                    pnl = (entry - exit_price) / entry * 100
                conn.execute(
                    """UPDATE signals SET status='CLOSED', exit_price=?,
                       pnl_percent=?, closed_at=datetime('now') WHERE id=?""",
                    (exit_price, round(pnl, 2), signal_id)
                )
                conn.commit()
                self._json_response({"status": "closed", "pnl_percent": round(pnl, 2)})
            else:
                self._json_response({"error": "Signal not found"}, 404)

        elif path == "/api/daily-log":
            conn.execute(
                """INSERT OR REPLACE INTO daily_log
                   (date, starting_balance, ending_balance, daily_return_pct, notes)
                   VALUES (?, ?, ?, ?, ?)""",
                (data["date"], data["starting_balance"], data["ending_balance"],
                 data["daily_return_pct"], data.get("notes", ""))
            )
            conn.commit()
            self._json_response({"status": "logged"})

        elif path == "/api/settings":
            for key, value in data.items():
                conn.execute(
                    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
                    (key, str(value))
                )
            conn.commit()
            self._json_response({"status": "saved"})

        else:
            self._json_response({"error": "Not found"}, 404)

        conn.close()

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


def main():
    init_db()
    server = http.server.HTTPServer(("0.0.0.0", PORT), TradingHandler)
    print(f"""
╔══════════════════════════════════════════════════╗
║       CRYPTO TRADING ADVISOR                     ║
║       Daily Compound Target: 1.25%               ║
╠══════════════════════════════════════════════════╣
║  Server running at http://localhost:{PORT}         ║
║  Press Ctrl+C to stop                            ║
╠══════════════════════════════════════════════════╣
║  DISCLAIMER: For educational purposes only.      ║
║  This is NOT financial advice.                   ║
╚══════════════════════════════════════════════════╝
    """)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.server_close()


if __name__ == "__main__":
    main()
