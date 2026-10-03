# SentinelAI Security Demo

## 2-Minute Demo Script

### 0:00–0:20 — Introduction

"SentinelAI is a security-focused AI system that analyzes authentication events, identifies suspicious login behavior, enriches those events with mock threat-intelligence data, and connects them to security response playbooks.

For this demonstration, all security data is synthetic and all IP addresses are reserved or private test addresses."

### 0:20–0:45 — Normal Activity

"Let's start with normal activity.

ID 8 shows one failed login from 10.0.0.12, while ID 10 shows three failed attempts from 10.0.0.20.

These events are below the brute-force threshold of 10 failed logins within five minutes, so they are labeled normal."

### 0:45–1:05 — Brute-Force Detection

"Now look at ID 4.

The finance account received 60 failed login attempts from the same source IP within five minutes.

Our brute-force playbook defines 10 or more failed logins from one IP within five minutes as an attack indicator.

The system can check the mock IP reputation and recommend blocking the source IP, resetting the password, and monitoring the account."

### 1:05–1:30 — Tricky Cases

"We also added three cases to test the detection logic.

ID 11 has eight failed attempts by a normal user. Because it is below the threshold, it remains normal.

ID 12 has 12 failed attempts, crossing the threshold and becoming an attack case.

ID 13 is the most important case. It records a successful login after repeated failures. The brute-force playbook says this condition should be escalated because the account may be compromised."

### 1:30–1:50 — Response Playbooks

"SentinelAI now has four response options represented by playbooks: brute-force response, account lockout, MFA enforcement, and IP blocking.

This means detection can be connected to a structured response rather than simply generating an alert."

### 1:50–2:00 — Conclusion

"The overall workflow is simple: detect the authentication pattern, check mock threat intelligence, identify the relevant playbook, and recommend a controlled response.

The demo is completely synthetic and isolated from real systems."

---

# Judge Questions and Answers

## 1. What problem does SentinelAI address?

SentinelAI demonstrates how security systems can analyze authentication logs, identify suspicious behavior, enrich events with threat-intelligence information, and connect detections to response playbooks.

## 2. Is the data in this demonstration real?

No. All login events, users, reputation scores, and labels are synthetic data created for the security lab.

## 3. Are these real malicious IP addresses?

No. The IP addresses are reserved documentation ranges or private-use addresses. They are being used only as test data.

## 4. How is a brute-force attack identified?

The existing brute-force playbook defines the indicator as 10 or more failed logins from one IP within five minutes.

## 5. Why is ID 11 labeled normal?

ID 11 contains eight failed login attempts within five minutes. That is below the 10-attempt threshold used by the brute-force playbook, so it tests a borderline normal case.

## 6. Why is ID 12 labeled attack?

ID 12 contains 12 failed login attempts within five minutes. This exceeds the 10-attempt threshold and therefore matches the brute-force attack indicator.

## 7. Why is ID 13 an important test case?

ID 13 represents a successful login after repeated failures. The existing brute-force playbook specifies that a successful login following the failures should be escalated because the account may be compromised.

## 8. What does the threat-intelligence score mean?

The score is a synthetic reputation value from 0 to 100. It is included to demonstrate security-data enrichment and does not represent a real-world reputation service.

## 9. What response actions are represented?

The playbooks cover brute-force response, account lockout, MFA enforcement, and IP blocking. They provide structured steps for responding to suspicious authentication activity in a sandbox.

## 10. How could SentinelAI be extended?

A production version could integrate real SIEM data, authenticated identity-provider events, trusted threat-intelligence feeds, alerting, audit logs, role-based access controls, and carefully controlled automated response mechanisms.
