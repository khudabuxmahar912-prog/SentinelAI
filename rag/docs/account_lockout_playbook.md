# Playbook: Account Lockout

Indicators: Repeated failed login attempts against the same user account.

Steps:
1. Confirm the failed-login pattern in logs.
2. Identify the affected user account and source IP.
3. Check the source IP reputation.
4. Lock the affected account in the sandbox environment.
5. Notify the user or security administrator.
6. Review recent authentication activity.
7. Monitor the account for further suspicious activity.

Escalate: if a successful login follows repeated failures or multiple source IPs target the same account.
