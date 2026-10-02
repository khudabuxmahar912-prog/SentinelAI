import json
from datetime import datetime, timezone

from agents.agents import (orchestrator, detection, investigation, threat_intel,
                           risk, critic, response, monitoring, now)

PRE_APPROVAL = [orchestrator, detection, investigation, threat_intel, risk, critic]
POST_APPROVAL = [response, monitoring]


def new_incident(event, incident_id=1):
    return {"id": incident_id, "status": "running", "created_at": now(), "event": event,
            "risk_score": None, "severity": None, "mitre": None,
            "recommended_action": None, "critic_verdict": None,
            "steps": [], "approval": None, "report": None}


def run_pre_approval(inc):
    for agent in PRE_APPROVAL:
        inc["steps"].append(agent(inc))
    inc["status"] = "pending_approval"
    return inc


def run_post_approval(inc, approved, comment=""):
    inc["approval"] = {"approved": approved, "comment": comment, "at": now()}
    if not approved:
        inc["status"] = "rejected"
        inc["report"] = {"summary": "Rejected by human", "actions_taken": [],
                         "time_to_respond_seconds": 0}
        return inc
    for agent in POST_APPROVAL:
        inc["steps"].append(agent(inc))
    start = datetime.fromisoformat(inc["created_at"].replace("Z", "+00:00"))
    secs = int((datetime.now(timezone.utc) - start).total_seconds())
    ip = inc["event"]["source_ip"]
    inc["status"] = "responded"
    inc["report"] = {"summary": f"Brute-force attack from {ip} contained",
                     "actions_taken": [f"Blocked {ip} (sandbox)"],
                     "time_to_respond_seconds": secs}
    return inc


if __name__ == "__main__":
    sample = {"type": "failed_login", "source_ip": "203.0.113.45",
              "user": "admin", "failed_attempts": 27, "window_minutes": 5}
    inc = run_pre_approval(new_incident(sample))
    print("STATUS:", inc["status"], "| steps:", len(inc["steps"]))
    inc = run_post_approval(inc, True, "ok")
    print("STATUS:", inc["status"], "| steps:", len(inc["steps"]))
    print(json.dumps(inc, indent=2))