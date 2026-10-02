import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "sentinelai.db"


def conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init_db():
    with conn() as c:
        c.execute("CREATE TABLE IF NOT EXISTS incidents "
                  "(id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL)")


def create_incident(inc):
    with conn() as c:
        cur = c.execute("INSERT INTO incidents (data) VALUES (?)", (json.dumps(inc),))
        inc["id"] = cur.lastrowid
        c.execute("UPDATE incidents SET data=? WHERE id=?", (json.dumps(inc), inc["id"]))
    return inc


def save_incident(inc):
    with conn() as c:
        c.execute("UPDATE incidents SET data=? WHERE id=?", (json.dumps(inc), inc["id"]))


def get_incident(incident_id):
    with conn() as c:
        row = c.execute("SELECT data FROM incidents WHERE id=?", (incident_id,)).fetchone()
    return json.loads(row["data"]) if row else None


def list_incidents():
    with conn() as c:
        rows = c.execute("SELECT data FROM incidents ORDER BY id DESC").fetchall()
    return [json.loads(r["data"]) for r in rows]