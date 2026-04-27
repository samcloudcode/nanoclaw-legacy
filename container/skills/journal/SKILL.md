---
name: journal
description: Add journal entries to the Obsidian vault. Use when the user wants to journal, write a journal entry, add to their journal, reflect on their day, record gratitude, wins, or lessons learned. Also triggers on "create journal entry", "add to journal", or when user shares personal reflections they want saved.
---

# Journal Entries

Add journal entries to `/workspace/extra/vault/journal-entries/` with proper formatting and metadata.

## Entry Types

Support these entry types:
- **daily**: General daily reflection (default)
- **gratitude**: Things you're grateful for
- **wins**: Accomplishments and victories
- **lessons**: Lessons learned or insights
- **free**: Free-form entry with no prompts

## File Naming

Use `YYYY-MM-DD.md` format (e.g., `2026-04-21.md`). Default to today's date unless user specifies otherwise.

## Entry Format

### New File

```markdown
---
date: YYYY-MM-DD
tags:
  - journal
  - [entry-type]
mood: [optional - happy/grateful/reflective/challenging/energized/etc]
---

# [Day of Week], [Month DD, YYYY]

## HH:MM [Entry Type]

[Entry content]
```

### Appending to Existing File

When today's journal already exists, append with:

```markdown

## HH:MM [Entry Type]

[Entry content]
```

## Prompts by Type

### Daily Reflection
- What happened today?
- What am I grateful for?
- What did I learn?
- What could I improve tomorrow?

### Gratitude
- List 3-5 things you're grateful for today

### Wins
- What did I accomplish today?
- What am I proud of?

### Lessons
- What did I learn today?
- What insights emerged?
- What will I do differently?

## Usage Examples

**User:** "Add a journal entry - today was tough but I learned a lot about patience"
→ Create/append to today's journal with free-form entry

**User:** "Journal my wins for today"
→ Create/append wins entry with prompt if content not provided

**User:** "Gratitude journal entry"
→ Create/append gratitude entry

**User:** "Add to my journal: [long reflection]"
→ Create/append daily reflection with provided content

## Implementation

1. Determine entry type from user request (default: daily)
2. Get current date/time (use user's timezone from memory: Hong Kong/UTC+8)
3. Check if today's file exists at `/workspace/extra/vault/journal-entries/YYYY-MM-DD.md`
4. If new file:
   - Create with YAML frontmatter
   - Add header with full date
   - Add timestamped section
5. If appending:
   - Read existing file
   - Append new timestamped section
6. If user didn't provide content, offer type-specific prompts
7. Use Write or Edit tool as appropriate
8. Confirm entry added

## Audio Dictation Processing

When user dictates journal entries (often via audio), DO NOT transcribe verbatim. Instead:
- Summarise and structure the content properly
- Pull out key themes and insights
- Clean up run-on sentences and repetition
- Organise thoughts into coherent paragraphs
- Preserve the user's voice and meaning, but improve clarity
- Use proper punctuation and formatting

## Time Formatting

Use 24-hour format (HH:MM) for timestamps. Convert to Hong Kong time (UTC+8) if needed.

## Mood Detection

If user expresses emotion in their entry, suggest adding mood to frontmatter:
- happy, grateful, reflective, challenging, energized, peaceful, frustrated, excited, contemplative, melancholy

Don't force it - mood is optional.
