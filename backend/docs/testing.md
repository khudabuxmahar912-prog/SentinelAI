# Backend API testing

Start the API from `backend/`:

```bash
source venv/bin/activate
python -m uvicorn main:app --reload --reload-exclude 'venv/*'
```

Open the interactive API documentation at <http://127.0.0.1:8000/docs>.

## Endpoint checks

Run these checks in the Swagger UI or with `curl`:

1. `GET /health` returns `200` and a `status` of `ok`.

   ```bash
   curl -i http://127.0.0.1:8000/health
   ```

2. `GET /events` returns `200` and the list loaded from `security-lab/logs.json`.

   ```bash
   curl -i http://127.0.0.1:8000/events
   ```

3. `GET /metrics` returns `200` with `total_incidents`, `responded`, `rejected`, and `average_time_to_respond_seconds`.

   ```bash
   curl -i http://127.0.0.1:8000/metrics
   ```

4. `POST /incidents/run` returns `200` for a valid event. Use an `id` returned by `GET /events`.

   ```bash
   curl -i -X POST http://127.0.0.1:8000/incidents/run \
     -H 'Content-Type: application/json' \
     -d '{"event_id": 1}'
   ```

5. `GET /incidents` returns `200` and includes the incident created above.

   ```bash
   curl -i http://127.0.0.1:8000/incidents
   ```

6. `GET /incidents/{incident_id}` returns `200` for the incident ID returned by `POST /incidents/run`.

   ```bash
   curl -i http://127.0.0.1:8000/incidents/1
   ```

7. `POST /incidents/{incident_id}/approve` returns `200`. Use the incident ID returned by `POST /incidents/run`.

   ```bash
   curl -i -X POST http://127.0.0.1:8000/incidents/1/approve \
     -H 'Content-Type: application/json' \
     -d '{"approved": true, "comment": "Approved for testing"}'
   ```

8. Run `GET /metrics` again. It returns `200` and reflects the responded or rejected incident and its response time.

## Error checks

- Send `{"event_id":"bad"}` to `POST /incidents/run`. The API returns `400` with `Invalid request data`.
- Send `{}` to `POST /incidents/{incident_id}/approve`. The API returns `400` with `Invalid request data`.
- If `security-lab/logs.json` is missing or contains invalid JSON, `GET /events` and `POST /incidents/run` return `500` with a clear log-file message.
