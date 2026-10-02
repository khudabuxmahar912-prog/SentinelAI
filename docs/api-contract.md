# SentinelAI API Contract (FROZEN, do not change without telling the leader)

Base URL: http://localhost:8000

## Endpoints

| Method | Path                    | Purpose                                                                                                                     |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| GET    | /health                 | Server check                                                                                                                |
| POST   | /incidents/run          | Start the pipeline on one synthetic event. Body: `{"event_id": 1}`. Returns Incident (status `pending_approval` when ready) |
| GET    | /incidents              | List of Incident (newest first)                                                                                             |
| GET    | /incidents/{id}         | One Incident                                                                                                                |
| POST   | /incidents/{id}/approve | Body: `{"approved": true, "comment": "ok"}`. Runs response + monitoring, returns Incident                                   |

## Status values

`running` | `pending_approval` | `responded` | `rejected` | `failed`

## Agent names (in order)

`orchestrator`, `detection`, `investigation`, `threat_intel`, `risk`, `critic`, `response`, `monitoring`

## Incident object

```json
{
  "id": 1,
  "status": "pending_approval",
  "created_at": "2026-10-03T20:00:00Z",
  "event": {
    "type": "failed_login",
    "source_ip": "203.0.113.45",
    "user": "admin",
    "failed_attempts": 27,
    "window_minutes": 5
  },
  "risk_score": 87,
  "severity": "high",
  "mitre": { "id": "T1110", "name": "Brute Force" },
  "recommended_action": "block_ip",
  "critic_verdict": "approved",
  "steps": [
    {
      "agent": "detection",
      "summary": "Brute-force pattern detected",
      "output": { "is_attack": true, "confidence": 0.93 },
      "timestamp": "2026-10-03T20:00:02Z"
    }
  ],
  "approval": null,
  "report": null
}
```

## After approval

- `approval`: `{"approved": true, "comment": "ok", "at": "2026-10-03T20:05:00Z"}`
- `status`: `responded` (or `rejected` if approved is false)
- `report`: `{"summary": "...", "actions_taken": ["Blocked 203.0.113.45 (sandbox)"], "time_to_respond_seconds": 42}`

## Errors

`{"detail": "message"}` with HTTP 404 (not found), 400 (bad input) or 500 (pipeline failed).

## Rules

- All times are ISO 8601 UTC.
- Responses are sandbox-only: "block_ip" only writes to the database, never touches a real firewall.
- CORS allows http://localhost:5173.
