---
name: whatsapp-contacts
description: Look up WhatsApp contacts by name and retrieve their messages. Use when the user asks about messages from a specific person by name (e.g., "what did Sunny say", "check messages from John", "last message from Sarah"). Also use when listing contacts or searching for someone's phone number/JID.
---

# WhatsApp Contacts

Efficiently find WhatsApp contacts by name and retrieve their chat history. Solves the problem that contact names are only stored in the messages table, not the chats table.

## Quick Usage

**Find a contact and get their messages:**
```bash
# Find contact JID by name
JID=$(bash /home/node/.claude/skills/whatsapp-contacts/scripts/find-contact.sh sunny)

# Get recent messages from that contact
mcp__nanoclaw__query_chat --jid "$JID" --limit 10
```

## Scripts

### find-contact.sh

Find contact JID by partial name match (case insensitive).

```bash
bash scripts/find-contact.sh <search-term>
```

**Returns:**
- Single JID if exactly one match (stdout)
- Error + list of matches if multiple found (stderr, exit 1)
- Error if no match (stderr, exit 1)

**Examples:**
```bash
# Exact or partial match
bash scripts/find-contact.sh sunny      # Returns: 85292429862@s.whatsapp.net
bash scripts/find-contact.sh sunn       # Same result
bash scripts/find-contact.sh SUNNY      # Case insensitive

# Multiple matches
bash scripts/find-contact.sh john
# Output (stderr):
# Multiple matches found for "john":
#   John Smith                | 85212345678@s.whatsapp.net
#   Johnny                    | 85298765432@s.whatsapp.net
```

## Common Patterns

**Example workflow:**
```bash
# User: "What did Sunny say last?"

# Step 1: Find Sunny's JID
JID=$(bash /home/node/.claude/skills/whatsapp-contacts/scripts/find-contact.sh sunny)

# Step 2: Get messages (using MCP tool)
# (Use the mcp__nanoclaw__query_chat tool with the JID parameter)

# Step 3: Report the last message to user
```

**Handle multiple matches:**
```bash
# If find-contact.sh exits with error due to multiple matches,
# ask the user to clarify which contact they mean, then use
# the full name or a more specific search term.
```

**List all contacts by querying directly:**
```bash
cd /workspace/project && node -e "
const sqlite3 = require('better-sqlite3');
const db = new sqlite3('store/messages.db');
const contacts = db.prepare(\`
  SELECT DISTINCT m.sender_name, m.chat_jid, MAX(m.timestamp) as last_msg
  FROM messages m
  WHERE m.chat_jid LIKE '%@s.whatsapp.net'
    AND m.sender_name IS NOT NULL
    AND m.is_from_me = 0
  GROUP BY m.sender_name, m.chat_jid
  ORDER BY last_msg DESC
  LIMIT 50
\`).all();
contacts.forEach(c => {
  const d = new Date(c.last_msg * 1000).toLocaleString();
  console.log(c.sender_name.padEnd(25) + ' | ' + c.chat_jid.replace('@s.whatsapp.net','').padEnd(15) + ' | Last: ' + d);
});
"
```
