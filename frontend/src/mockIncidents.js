// File Path: src/mockIncidents.js

export const initialIncidents = [
  {
    id: "INC-101",
    title: "Multiple Failed SSH Logins (Brute Force)",
    severity: "HIGH",
    status: "PENDING",
    mitreTechnique: "T1110 - Brute Force",
    sourceIp: "192.168.1.105",
    attempts: 45,
    timestamp: "2026-10-03 09:45:12",
    playbook: "Block Source IP on Firewall & Reset User Password"
  },
  {
    id: "INC-102",
    title: "RDP Password Spraying Attempt",
    severity: "CRITICAL",
    status: "PENDING",
    mitreTechnique: "T1110.003 - Password Spraying",
    sourceIp: "203.0.113.42",
    attempts: 120,
    timestamp: "2026-10-03 09:50:00",
    playbook: "Enable MFA & Revoke Active User Sessions"
  },
  {
    id: "INC-103",
    title: "Credential Stuffing on Web Admin Panel",
    severity: "MEDIUM",
    status: "APPROVED",
    mitreTechnique: "T1110.004 - Credential Stuffing",
    sourceIp: "198.51.100.18",
    attempts: 15,
    timestamp: "2026-10-03 08:30:22",
    playbook: "Rate limit endpoint & notify affected accounts"
  }
];