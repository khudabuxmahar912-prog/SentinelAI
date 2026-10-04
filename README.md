# SentinelAI: Autonomous Multi-Agent Cybersecurity Platform

Agentic AI / Cybersecurity hackathon project. SentinelAI takes a security event, runs it through a pipeline of specialised agents, and asks a human to approve before any response is taken. All data and responses are synthetic and sandboxed.

## Pipeline
Security event → Orchestrator → Detection → Investigation → Threat Intelligence → Risk → Critic → **Human approval** → Response (sandbox) → Monitoring → Incident report

## What works today
- 8 agents running end to end through one pipeline
- Human-in-the-loop approve / reject
- 13 synthetic events (brute force, normal logins, edge cases) in `security-lab/logs.json`
- MITRE ATT&CK T1110 (Brute Force) mapping and response playbooks in `rag/docs`
- Sample threat-intel scores in `security-lab/threat_intel.json`
- FastAPI backend with SQLite storage, `/metrics` endpoint and input validation
- React + Tailwind dashboard

## Safety
Defensive use only. Synthetic logs, reserved test IPs, and a sandboxed response: "blocking" an IP only records it in the database. No real system is touched.

## Run locally
Backend:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Frontend (second terminal):
```
cd frontend
npm install
npm run dev
```
Dashboard: http://localhost:5173 | API docs: http://localhost:8000/docs

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /health | Server check |
| GET | /events | List synthetic events |
| POST | /incidents/run | Run the pipeline on an event |
| GET | /incidents | List incidents |
| GET | /incidents/{id} | One incident |
| POST | /incidents/{id}/approve | Approve or reject |
| GET | /metrics | Totals and average response time |

## Team
- Khuda Bux(team lead): Agent pipeline, integration
- Wahab: frontend
- Siffatullah: backend
- Umar: security data, threat intel, playbooks

## Roadmap
- LLM-powered agents with rule-based fallback
- RAG over the playbooks
- Wazuh / Suricata integration
- Live monitoring after response
