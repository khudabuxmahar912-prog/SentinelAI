# Playbook: MFA Enforcement

Indicators: Suspicious authentication activity involving repeated failed logins or a successful login following multiple failures.

Steps:
1. Confirm the authentication pattern in logs.
2. Identify the affected user account.
3. Check the source IP reputation.
4. Enable MFA for the affected account in the sandbox environment.
5. Require MFA verification on the next login.
6. Review recent authentication activity.
7. Monitor the account for additional suspicious events.

Escalate: if suspicious activity continues after MFA enforcement or a successful login follows repeated failures.
