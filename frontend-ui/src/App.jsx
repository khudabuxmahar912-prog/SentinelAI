import { useEffect, useState } from 'react'

const API = 'http://localhost:8000'
const headers = { 'Content-Type': 'application/json' }

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [eventId, setEventId] = useState(1)
  const [error, setError] = useState('')

  const load = () =>
    fetch(`${API}/incidents`).then(r => r.json()).then(setIncidents)
      .catch(() => setError('Backend offline'))

  useEffect(() => { load() }, [])

  const run = async () => {
    setError('')
    const r = await fetch(`${API}/incidents/run`, {
      method: 'POST', headers, body: JSON.stringify({ event_id: Number(eventId) }) })
    if (!r.ok) setError('Run failed')
    load()
  }

  const approve = async (id, approved) => {
    await fetch(`${API}/incidents/${id}/approve`, {
      method: 'POST', headers, body: JSON.stringify({ approved, comment: '' }) })
    load()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">SentinelAI</h1>
      <div className="flex gap-2 mb-4">
        <input type="number" min="1" max="10" value={eventId}
          onChange={e => setEventId(e.target.value)}
          className="w-20 rounded bg-slate-800 px-2 py-1" />
        <button onClick={run} className="rounded bg-blue-600 px-4 py-1">Run pipeline</button>
      </div>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      {incidents.map(i => (
        <div key={i.id} className="mb-4 rounded bg-slate-800 p-4">
          <div className="flex justify-between">
            <b>Incident #{i.id}: {i.event.source_ip}</b>
            <span>{i.status} | risk {i.risk_score} | {i.severity}</span>
          </div>
          <ol className="mt-2 list-decimal pl-5 text-sm text-slate-300">
            {i.steps.map((s, n) => <li key={n}>{s.agent}: {s.summary}</li>)}
          </ol>
          {i.status === 'pending_approval' && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => approve(i.id, true)} className="rounded bg-green-600 px-3 py-1">Approve</button>
              <button onClick={() => approve(i.id, false)} className="rounded bg-red-600 px-3 py-1">Reject</button>
            </div>
          )}
          {i.report && <p className="mt-2 text-green-400">{i.report.summary}</p>}
        </div>
      ))}
    </div>
  )
}