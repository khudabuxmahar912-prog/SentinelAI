from datetime import datetime, timezone


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def make_step(agent, summary, output):
    return {"agent": agent, "summary": summary, "output": output, "timestamp": now()}


def get_output(inc, agent):
    for s in inc["steps"]:
        if s["agent"] == agent:
            return s["output"]
    return {}


def orchestrator(inc):
    return make_step("orchestrator", "Event received, pipeline started",
                     {"event_type": inc["event"]["type"]})


def detection(inc):
    attempts = inc["event"]["failed_attempts"]
    is_attack = attempts >= 10
    return make_step("detection",
                     "Brute-force pattern detected" if is_attack else "No attack pattern",
                     {"is_attack": is_attack, "confidence": 0.93 if is_attack else 0.2})


def investigation(inc):
    e = inc["event"]
    return make_step("investigation", "Repeated failures from a single IP",
                     {"source_ip": e["source_ip"], "targeted_user": e["user"],
                      "failed_attempts": e["failed_attempts"]})


def threat_intel(inc):
    return make_step("threat_intel", "IP has a bad reputation (mock data)",
                     {"ip_reputation": "malicious", "abuse_score": 95, "source": "mock"})


def risk(inc):
    attack = get_output(inc, "detection")["is_attack"]
    score = min(100, 40 + inc["event"]["failed_attempts"] * 2) if attack else 10
    inc["risk_score"] = score
    inc["severity"] = "high" if score >= 80 else "medium" if score >= 50 else "low"
    inc["mitre"] = {"id": "T1110", "name": "Brute Force"}
    inc["recommended_action"] = "block_ip" if attack else "none"
    return make_step("risk", f"Risk score {score} ({inc['severity']})",
                     {"risk_score": score, "severity": inc["severity"],
                      "recommended_action": inc["recommended_action"]})


def critic(inc):
    ok = get_output(inc, "detection")["is_attack"] and inc["risk_score"] >= 70
    inc["critic_verdict"] = "approved" if ok else "needs_review"
    return make_step("critic", f"Verdict: {inc['critic_verdict']}",
                     {"verdict": inc["critic_verdict"]})


def response(inc):
    ip = inc["event"]["source_ip"]
    return make_step("response", f"Sandbox: blocked {ip}",
                     {"action": inc["recommended_action"], "target": ip, "sandbox": True})


def monitoring(inc):
    return make_step("monitoring", "No new attempts after response",
                     {"new_failed_attempts": 0, "status": "stable"})