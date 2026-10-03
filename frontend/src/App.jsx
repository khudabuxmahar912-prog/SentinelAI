// File Path: src/App.jsx

import { useState } from "react";
import { initialIncidents } from "./mockIncidents";
import { fetchIncidents, approveIncident, runPipeline } from "./api";
import ReportPage from "./ReportPage";

export default function App() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleApprove = async (id) => {
    if (useRealApi) {
      try {
        setLoading(true);
        await approveIncident(id);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch {
        alert("API Error: Backend connect nahi ho paya!");
      } finally {
        setLoading(false);
      }
    } else {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "APPROVED" } : item
        )
      );
      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident((prev) => ({ ...prev, status: "APPROVED" }));
      }
    }
  };

  const handleRunPipeline = async () => {
    if (useRealApi) {
      try {
        setLoading(true);
        await runPipeline();
        const data = await fetchIncidents();
        setIncidents(data);
      } catch {
        alert("API Error: Backend run endpoint par issue hai!");
      } finally {
        setLoading(false);
      }
    } else {
      const newInc = {
        id: `INC-10${incidents.length + 1}`,
        title: "New Automated Brute Force Alert",
        severity: "CRITICAL",
        status: "PENDING",
        mitreTechnique: "T1110.001 - Password Guessing",
        sourceIp: "185.220.101.5",
        attempts: 89,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        playbook: "Block IP on Firewall immediately"
      };
      setIncidents([newInc, ...incidents]);
    }
  };

  const toggleApiMode = async () => {
    const nextMode = !useRealApi;
    setUseRealApi(nextMode);
    if (nextMode) {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch {
        alert("Backend server running nahi hai! Mock mode par waapis switch kar rahe hain.");
        setUseRealApi(false);
      } finally {
        setLoading(false);
      }
    } else {
      setIncidents(initialIncidents);
    }
  };

  if (activeTab === "report") {
    return (
      <div className="min-h-screen bg-slate-900">
        <ReportPage incidents={incidents} onBack={() => setActiveTab("dashboard")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded font-black text-xs tracking-wider">
            SOC
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Brute-Force Incident Response</h1>
            <p className="text-xs text-slate-400">MITRE ATT&CK Framework: T1110</p>
          </div>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "pipeline" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Pipeline View
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === "report" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Executive Report
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-900 px-3 py-1.5 rounded border border-slate-700">
            <input
              type="checkbox"
              checked={useRealApi}
              onChange={toggleApiMode}
              className="rounded bg-slate-800 border-slate-600 text-blue-600"
            />
            Connect Real API
          </label>

          <button
            onClick={handleRunPipeline}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded shadow transition"
          >
            {loading ? "Processing..." : "Run Detection"}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                Active Incidents ({incidents.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/50 text-slate-400 uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Threat</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {incidents.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedIncident(item)}
                        className={`hover:bg-slate-700/50 cursor-pointer transition ${
                          selectedIncident?.id === item.id ? "bg-slate-700/70" : ""
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-blue-400">{item.id}</td>
                        <td className="p-3 font-medium text-slate-200">{item.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.severity === "CRITICAL"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : item.severity === "HIGH"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={item.status === "APPROVED"}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-700">
                  Incident Forensics & Playbook
                </h2>
                {selectedIncident ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="text-slate-400">Incident ID & Title</p>
                      <p className="font-bold text-sm text-white">{selectedIncident.id}: {selectedIncident.title}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">MITRE ATT&CK Technique</p>
                      <p className="font-mono text-blue-400 bg-slate-900 p-1.5 rounded mt-1 border border-slate-700">
                        {selectedIncident.mitreTechnique}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900 p-2 rounded border border-slate-700">
                        <p className="text-slate-400 text-[10px]">Attacker IP</p>
                        <p className="font-mono text-red-400 font-bold">{selectedIncident.sourceIp}</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-700">
                        <p className="text-slate-400 text-[10px]">Failed Attempts</p>
                        <p className="font-mono text-amber-400 font-bold">{selectedIncident.attempts}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                      <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Recommended Response Playbook</p>
                      <p className="text-slate-200">{selectedIncident.playbook}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs py-12 text-center">
                    Table mein se kisi incident par click karke details dekhein.
                  </p>
                )}
              </div>

              {selectedIncident && (
                <button
                  onClick={() => handleApprove(selectedIncident.id)}
                  disabled={selectedIncident.status === "APPROVED"}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 rounded text-xs transition"
                >
                  {selectedIncident.status === "APPROVED" ? "Remediation Executed" : "Approve Remediation"}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
              Detection Pipeline Flow (T1110 Brute Force)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <span className="text-blue-400 font-bold">01. Log Ingestion</span>
                <p className="text-slate-400 mt-2">Auth logs (SSH/RDP/Web) streams read kiye jaate hain.</p>
              </div>
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <span className="text-amber-400 font-bold">02. Threshold Check</span>
                <p className="text-slate-400 mt-2">5 mins mein &gt; 10 failed logins detect hone par flag hota hai.</p>
              </div>
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <span className="text-red-400 font-bold">03. Alert Creation</span>
                <p className="text-slate-400 mt-2">MITRE T1110 tagged incident generate ho kar DB mein save hota hai.</p>
              </div>
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <span className="text-emerald-400 font-bold">04. SOC Approval</span>
                <p className="text-slate-400 mt-2">Analyst Approve button daba kar block action execute karta hai.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}