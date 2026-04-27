#!/bin/bash
# Find WhatsApp contact JID by name (partial match, case insensitive)
# Usage: bash find-contact.sh <search-term>

if [ -z "$1" ]; then
  echo "Usage: bash find-contact.sh <search-term>" >&2
  exit 1
fi

SEARCH_TERM="$1"

cd /workspace/project

node -e "
const sqlite3 = require('better-sqlite3');
const db = new sqlite3('/workspace/project/store/messages.db');

const searchTerm = process.argv[1].toLowerCase();

const contacts = db.prepare(\`
  SELECT DISTINCT sender_name, chat_jid
  FROM messages
  WHERE chat_jid LIKE '%@s.whatsapp.net'
    AND sender_name IS NOT NULL
    AND is_from_me = 0
  ORDER BY sender_name
\`).all();

const matches = contacts.filter(c =>
  c.sender_name.toLowerCase().includes(searchTerm)
);

if (matches.length === 0) {
  console.error(\`No contacts found matching \"\${searchTerm}\"\`);
  process.exit(1);
} else if (matches.length === 1) {
  console.log(matches[0].chat_jid);
} else {
  // Check for exact match first
  const exact = matches.filter(c =>
    c.sender_name.toLowerCase() === searchTerm
  );
  if (exact.length === 1) {
    console.log(exact[0].chat_jid);
  } else {
    console.error(\`Multiple matches found for \"\${searchTerm}\":\`);
    matches.forEach(c => {
      console.error(\`  \${c.sender_name.padEnd(25)} | \${c.chat_jid}\`);
    });
    process.exit(1);
  }
}
" "$SEARCH_TERM"
