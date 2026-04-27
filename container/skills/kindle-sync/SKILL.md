---
name: kindle-sync
description: |
  Convert Obsidian notes to epub/pdf and automatically email to Kindle.
  Trigger when user asks to send/sync a note to their Kindle or e-reader.
---

# Kindle Sync

Convert an Obsidian note to epub or PDF and automatically email it to Kindle.

## When to use
User asks to "send to Kindle", "sync to Kindle", "put X on my Kindle", or "send X to my e-reader".

## How to use

1. Find the note in the vault at `/workspace/extra/vault/`. Use Glob or Grep to locate it if the user gives a partial name.
2. Run the sync script:

```bash
node /home/node/.claude/skills/kindle-sync/kindle-sync.mjs --file "/workspace/extra/vault/path/to/note.md"
```

The script will:
- Convert the markdown file to epub (or PDF if `--format pdf` specified)
- Save it to `/workspace/extra/vault/kindle-queue/` for backup
- Automatically email it to the Kindle address
- Display confirmation when sent

### Options
- `--file <path>` — **(required)** Path to the markdown file
- `--title <title>` — Override the epub title (defaults to filename)
- `--category <cat>` — Add category prefix to title (e.g., "Health" → "[Health] Title")
- `--format epub|pdf` — Output format (defaults to `epub`)
- `--email <address>` — Kindle email (defaults to `samstitt_toread@kindle.com`)
- `--no-send` — Convert only, don't email (for manual sending)

### Category Usage

Use `--category` to prefix titles for easier organization on Kindle:

```bash
# Health-related content
--category "Health"  → Title becomes "[Health] supplement-guide-rhonda-patrick"

# Science content
--category "Science" → Title becomes "[Science] synthetic-biology-briefing-2026"

# Business content
--category "Business" → Title becomes "[Business] blackpine-research"
```

After documents arrive, you can create Kindle collections and add all documents with the same category prefix.

**Suggested categories:**
- Health, Science, Business, Tech, Finance, Fiction, Travel, Fitness, Cooking, etc.

## Output

Files are saved to `/workspace/extra/vault/kindle-queue/` for backup, then automatically emailed to Kindle.

Document appears in Kindle library within minutes of successful email delivery.

## Markdown Formatting Requirements

**CRITICAL:** For proper rendering in epub format, follow these rules:

1. **Bullet lists require a blank line before them:**
   ```markdown
   *Section header:*

   - First bullet
   - Second bullet
   ```

2. **Do NOT add blank lines between bullets** (this creates excessive spacing)

3. **Do NOT put bullets directly after text without a blank line** (they won't render as a list)

**Correct:**
```markdown
*Key points:*

- Point one
- Point two
```

**Incorrect:**
```markdown
*Key points:*
- Point one (will run together as paragraph)

*Another way that's wrong:*

- Point one

- Point two (excessive spacing)
```

## Notes
- The script uses `pandoc` for conversion
- Kindle accepts both epub and PDF formats via email
- Epub is recommended for better reading experience (reflowable text)
- PDF preserves exact formatting but doesn't reflow on different screen sizes
- Default Kindle email: `samstitt_toread@kindle.com`
- Files are kept in `kindle-queue/` as backup copies
- Automatic email requires `samstitt_toread@kindle.com` to be on EMAIL_ALLOWLIST
- Category prefixes help organize documents into collections on your Kindle
