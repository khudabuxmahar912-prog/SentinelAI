// File Path: src/ReportPage.jsx

export default function ReportPage({ incidents, onBack }) {
  const totalIncidents = incidents.length;
  const approvedIncidents = incidents.filter((i) => i.status === "APPROVED").length;
  const pendingIncidents = incidents.filter((i) => i.status !== "APPROVED").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL").length;

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold mb-2 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-white">SOC Executive Incident Report</h1>
          <p className="text-xs text-slate-400">Targeted Threat: MITRE ATT&CK T1110 (Brute Force Detection)</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded shadow transition"
        >
          Print / Export PDF
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-xs font-bold uppercase">Total Threats</p>
          <p className="text-2xl font-bold text-white mt-1">{totalIncidents}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-xs font-bold uppercase">Mitigated (Approved)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{approvedIncidents}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-xs font-bold uppercase">Pending Actions</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendingIncidents}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded border border-slate-700">
          <p className="text-slate-400 text-xs font-bold uppercase">Critical Threats</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
          Incident Audit Log Summary
        </h2>
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-slate-900 p-4 rounded border border-slate-700/60 flex justify-between items-center text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400">{inc.id}</span>
                  <span className="font-semibold text-white">{inc.title}</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Source IP: <span className="font-mono text-slate-300">{inc.sourceIp}</span> | Technique: {inc.mitreTechnique}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inc.status === "APPROVED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {inc.status}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">{inc.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}