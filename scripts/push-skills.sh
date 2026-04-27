#!/bin/bash
set -euo pipefail

# Sync local container/skills/ → server vault.
# Additive by default — use --delete only when intentionally removing skills.
# Usage: ./scripts/push-skills.sh [--dry-run|-n] [--delete]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

LOCAL_SKILLS="$PROJECT_ROOT/container/skills/"
VAULT_REMOTE="nanoclaw:~/Documents/Life/NanoClaw/skills/"

DRY_RUN=false
DELETE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run|-n) DRY_RUN=true; shift ;;
    --delete) DELETE=true; shift ;;
    *) echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

RSYNC_ARGS=(-av --exclude='.obsidian/' --exclude='.DS_Store')

if [ "$DELETE" = "true" ]; then
  RSYNC_ARGS+=(--delete)
  echo "WARNING: --delete is active. Skills removed locally will be deleted from vault."
fi

if [ "$DRY_RUN" = "true" ]; then
  echo "=== DRY RUN: no changes will be made ==="
  rsync "${RSYNC_ARGS[@]}" --dry-run "$LOCAL_SKILLS" "$VAULT_REMOTE"
else
  echo "=== Pushing skills: container/skills/ → vault ==="
  rsync "${RSYNC_ARGS[@]}" "$LOCAL_SKILLS" "$VAULT_REMOTE"
  echo "Done. Changes take effect on next container start."
fi
