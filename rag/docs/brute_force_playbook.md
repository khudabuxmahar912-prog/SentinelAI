# Playbook: Brute-Force Login Attack

Indicators: 10+ failed logins from one IP within 5 minutes.
Steps: 1. Confirm the pattern in logs. 2. Check IP reputation. 3. Block the source IP (sandbox). 4. Reset the targeted account password. 5. Monitor for 30 minutes.
Escalate: if a successful login follows the failures, treat the account as compromised.
