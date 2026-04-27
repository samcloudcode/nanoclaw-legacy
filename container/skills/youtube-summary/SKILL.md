---
name: youtube-summary
description: |
  Summarize YouTube videos into Obsidian vault notes. Trigger when the user
  sends a YouTube link and asks to summarize, save, take notes on, or extract
  content from it.
---

# YouTube Summary Skill

Extract transcripts from YouTube videos, summarize them, and save structured notes to the Obsidian vault.

## yt-dlp flags

Always include these flags with every `yt-dlp` command:
- `--js-runtimes node` — use Node.js as the JS challenge solver
- `--remote-components ejs:github` — download latest challenge solver scripts
- `--cookies /workspace/extra/vault/NanoClaw/.yt-cookies.txt` — YouTube auth cookies (if file exists; omit flag if not)

## Steps

### 1. Get video metadata

```bash
yt-dlp --js-runtimes node --remote-components ejs:github --dump-json --skip-download --ignore-errors "<URL>" 2>/dev/null | jq '{title, channel, upload_date, duration_string, description, categories, tags}'
```

### 2. Extract transcript

```bash
rm -f /tmp/yt-*
yt-dlp --js-runtimes node --remote-components ejs:github --write-subs --write-auto-subs --sub-langs "en.*,en" --sub-format vtt --skip-download --ignore-errors -o "/tmp/yt-%(id)s" "<URL>" 2>&1
```

Then clean it:

```bash
node /home/node/.claude/skills/youtube-summary/clean-vtt.mjs /tmp/yt-*.en*.vtt
```

If no `.vtt` file was created, the video has no English captions. Tell the user and stop.

### 3. Summarize the transcript

Read the cleaned transcript and produce a structured summary:

- **Overview**: 2-3 sentence summary of what the video covers
- **Key Points**: Bulleted list of the main ideas/arguments/takeaways
- **Notable Quotes**: Any particularly insightful or quotable statements
- **Action Items**: Any recommended actions, tips, or things to try (if applicable)

Keep the summary concise but comprehensive. For very long videos (>1 hour), organize by topic/section.

### 4. Find the right vault location

Browse `/workspace/extra/vault/` to find the most appropriate folder for this note:

1. Look at the video's topic/category and the existing vault folder structure
2. If a suitable folder exists (e.g. a fitness video and there's a `health/fitness/` folder), use it
3. If an existing note on the same topic exists, consider appending or linking rather than duplicating
4. If no good match, create an appropriate subfolder
5. Default fallback: `/workspace/extra/vault/Resources/YouTube/`

### 5. Write the note

Write a markdown file with this structure:

```markdown
---
source: <YouTube URL>
channel: <channel name>
date: <YYYY-MM-DD of when you watched/saved it>
published: <YYYY-MM-DD upload date>
duration: <duration string>
tags:
  - youtube
  - <topic tags>
---

# <Video Title>

<Summary content from step 3>

## Transcript

<details>
<summary>Full transcript (click to expand)</summary>

<cleaned transcript text>

</details>
```

### 6. Clean up

```bash
rm -f /tmp/yt-*
```

Tell the user where the note was saved and give a brief summary.
