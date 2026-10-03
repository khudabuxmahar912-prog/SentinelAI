import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import db
from pipeline import new_incident, run_pre_approval, run_post_approval


@asynccontextmanager
async def lifespan(app):
    db.init_db()
    yield


app = FastAPI(title="SentinelAI", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[
                       "http://localhost:5173", "http://127.0.0.1:5173"],
                   allow_methods=["*"], allow_headers=["*"])

LOGS_PATH = Path(__file__).parent.parent / "security-lab" / "logs.json"


class RunBody(BaseModel):
    event_id: int = 1


class ApproveBody(BaseModel):
    approved: bool
    comment: str = ""


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={
        "detail": "Invalid request data",
        "errors": jsonable_encoder(exc.errors()),
    })


def load_logs():
    try:
        logs = json.loads(LOGS_PATH.read_text())
    except FileNotFoundError:
        raise HTTPException(500, "Event log file is missing: security-lab/logs.json")
    except json.JSONDecodeError:
        raise HTTPException(500, "Event log file is invalid JSON: security-lab/logs.json")
    if not isinstance(logs, list):
        raise HTTPException(500, "Event log file must contain a JSON list")
    return logs


@app.get("/health")
def health():
    return {"status": "ok", "service": "SentinelAI"}


@app.get("/events")
def events():
    return load_logs()


@app.get("/metrics")
def metrics():
    incidents = db.list_incidents()
    responded = [incident for incident in incidents if incident.get("status") == "responded"]
    rejected = sum(incident.get("status") == "rejected" for incident in incidents)
    response_times = [
        incident["report"]["time_to_respond_seconds"]
        for incident in responded
        if isinstance(incident.get("report", {}).get("time_to_respond_seconds"), (int, float))
    ]
    average = sum(response_times) / len(response_times) if response_times else 0.0
    return {
        "total_incidents": len(incidents),
        "responded": len(responded),
        "rejected": rejected,
        "average_time_to_respond_seconds": round(average, 2),
    }


@app.post("/incidents/run")
def run_incident(body: RunBody):
    logs = load_logs()
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