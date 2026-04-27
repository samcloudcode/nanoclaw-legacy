#!/bin/bash
set -euo pipefail

# Sync server vault skills → local container/skills/ for git version tracking.
# Usage: ./scripts/pull-skills.sh [--dry-run|-n]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

VAULT_REMOTE="nanoclaw:~/Documents/Life/NanoClaw/skills/"
LOCAL_SKILLS="$PROJECT_ROOT/container/skills/"

DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run|-n) DRY_RUN=true; shift ;;
    *) echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

RSYNC_ARGS=(-av --delete --exclude='.obsidian/' --exclude='.DS_Store')

if [ "$DRY_RUN" = "true" ]; then
  echo "=== DRY RUN: no changes will be made ==="
  rsync "${RSYNC_ARGS[@]}" --dry-run "$VAULT_REMOTE" "$LOCAL_SKILLS"
else
  echo "=== Pulling skills: vault → container/skills/ ==="
  rsync "${RSYNC_ARGS[@]}" "$VAULT_REMOTE" "$LOCAL_SKILLS"
  echo ""
  echo "=== Git status ==="
  git -C "$PROJECT_ROOT" status container/skills/
fi
