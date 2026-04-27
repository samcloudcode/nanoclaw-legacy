---
name: send-email
description: Send a plain-text email to a pre-approved recipient via Mailtrap. Use when the user asks to email, send a note, or notify someone by email. The recipient must be on the allowlist — the skill will hard-refuse otherwise.
---

# Send Email

## When to use
User asks to "email", "send an email to", "shoot a note to" someone.
The recipient must be on the allowlist (env: `EMAIL_ALLOWLIST`). If unsure who is allowed, run the script with no args — it prints the current allowlist.

## How to use
Pipe the body in via stdin. `--to` and `--subject` are CLI args:

```bash
node /home/node/.claude/skills/send-email/send-email.mjs \
  --to "alice@example.com" \
  --subject "hello" <<'EOF'
This is the email body.
Multiple lines, quotes, anything works — it's stdin.
EOF
```

On success: prints `sent: <message_id>` and exits 0.
On failure: prints reason to stderr and exits non-zero.

## Failure modes
- `MAILTRAP_TOKEN not set` / `EMAIL_ALLOWLIST not set` → setup incomplete; tell the user.
- `recipient <x> not on allowlist (allowed: ...)` → do NOT retry with a different address. Tell the user which addresses ARE allowed and let them decide.
- HTTP 401/403 from Mailtrap → token invalid/expired.
