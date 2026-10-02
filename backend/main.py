import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import db
from pipeline import new_incident, run_pre_approval, run_post_approval


@asynccontextmanager
async def lifespan(app):
    db.init_db()
    yield


app = FastAPI(title="SentinelAI", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])

LOGS_PATH = Path(__file__).parent.parent / "security-lab" / "logs.json"


class RunBody(BaseModel):
    event_id: int = 1


class ApproveBody(BaseModel):
    approved: bool
    comment: str = ""


@app.get("/health")
def health():
    return {"status": "ok", "service": "SentinelAI"}


@app.post("/incidents/run")
def run_incident(body: RunBody):
    logs = json.loads(LOGS_PATH.read_text())
    row = next((l for l in logs if l["id"] == body.event_id), None)
    if row is None:
        raise HTTPException(404, "event not found")
    keys = ("type", "source_ip", "user", "failed_attempts", "window_minutes")
    inc = db.create_incident(new_incident({k: row[k] for k in keys}))
    try:
        run_pre_approval(inc)
    except Exception as e:
        inc["status"] = "failed"
        db.save_incident(inc)
        raise HTTPException(500, f"pipeline failed: {e}")
    db.save_incident(inc)
    return inc


@app.get("/incidents")
def incidents():
    return db.list_incidents()


@app.get("/incidents/{incident_id}")
def incident(incident_id: int):
    inc = db.get_incident(incident_id)
    if inc is None:
        raise HTTPException(404, "incident not found")
    return inc


@app.post("/incidents/{incident_id}/approve")
def approve(incident_id: int, body: ApproveBody):
    inc = db.get_incident(incident_id)
    if inc is None:
        raise HTTPException(404, "incident not found")
    if inc["status"] != "pending_approval":
        raise HTTPException(400, "incident is not waiting for approval")
    run_post_approval(inc, body.approved, body.comment)
    db.save_incident(inc)
    return inc