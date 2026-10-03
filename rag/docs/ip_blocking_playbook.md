# Playbook: IP Blocking

Indicators: 10+ failed logins from one IP within 5 minutes or a high mock IP reputation score.

Steps:
1. Confirm the suspicious login pattern in logs.
2. Identify the source IP and affected account.
3. Check the source IP against the mock threat-intelligence data.
4. Block the source IP in the sandbox environment.
5. Record the IP, affected account, attempt count, and reason for blocking.
6. Monitor logs for activity from other source IPs.
7. Review the block before removing it.

Escalate: if the IP targets multiple accounts, has a high mock reputation score, or a successful login follows repeated failures.
