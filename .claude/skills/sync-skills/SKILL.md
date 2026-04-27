---
name: sync-skills
description: Sync agent skills between the server vault and the local git repo. Use when the user wants to pull live skill changes the agent made into git, push git skill edits to the server, or review what skills have changed. Triggers on "sync skills", "pull skills", "push skills", "update skills from vault", "commit skill changes".
---

# Skills Sync

The vault (`nanoclaw:~/Documents/Life/NanoClaw/skills/`) is the live source of truth — it's mounted into containers. Git (`container/skills/`) is the version archive. Pull captures agent edits; push deploys local edits.

## Pull: vault → git (most common)

Run after the agent has created or modified skills live in a container session:

```bash
./scripts/pull-skills.sh             # sync + show git status
./scripts/pull-skills.sh --dry-run   # preview only
```

Uses `--delete` — vault is authoritative; local files not in vault are removed.

## Push: git → vault

Run after editing skills locally in the repo. Additive by default (safe):

```bash
./scripts/push-skills.sh             # sync to server, no delete
./scripts/push-skills.sh --delete    # also remove vault skills not in git
./scripts/push-skills.sh --dry-run   # preview only
```

## Workflow after a pull

1. Run `./scripts/pull-skills.sh` and review the git status output
2. Show the user what changed — new skills, modified files, removed skills
3. Ask: "Want me to commit these changes?"
4. If yes: `git add container/skills/` and commit with a message like `skills: sync from vault — add <name>, update <name>`
5. Offer to push the commit to remote if relevant
