#!/usr/bin/env node
/**
 * send-email.mjs — Send email to an allowlisted recipient via Mailtrap.
 *
 * Usage:
 *   node send-email.mjs --to <addr> --subject <subj> <<<"body"
 *   node send-email.mjs --to <addr> --subject <subj> --attach <file> <<<"body"
 *
 * Requires: MAILTRAP_TOKEN, EMAIL_ALLOWLIST (comma-separated) env vars.
 */

import { readFileSync } from 'fs';
import { basename } from 'path';

const SENDER_EMAIL = 'hello@life-ops.co';
const SENDER_NAME = 'NanoClaw';
const API_URL = 'https://send.api.mailtrap.io/api/send';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--to' && argv[i + 1]) args.to = argv[++i];
    else if (argv[i] === '--subject' && argv[i + 1]) args.subject = argv[++i];
    else if (argv[i] === '--attach' && argv[i + 1]) args.attach = argv[++i];
  }
  return args;
}

function buildAllowlist() {
  const raw = process.env.EMAIL_ALLOWLIST;
  if (!raw) return null;
  return new Set(raw.split(',').map(a => a.trim().toLowerCase()).filter(Boolean));
}

async function readStdin() {
  let data = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

const allowlist = buildAllowlist();
const token = process.env.MAILTRAP_TOKEN;
const args = parseArgs(process.argv);

if (!allowlist) {
  console.error('EMAIL_ALLOWLIST not set');
  process.exit(1);
}

if (!args.to || !args.subject) {
  console.error(`usage: send-email.mjs --to <addr> --subject <subj> [--attach <file>]  (body on stdin)\nallowlist: ${[...allowlist].join(', ')}`);
  process.exit(1);
}

const to = args.to.trim().toLowerCase();
if (!allowlist.has(to)) {
  console.error(`recipient ${args.to} not on allowlist (allowed: ${[...allowlist].join(', ')})`);
  process.exit(1);
}

if (!token) {
  console.error('MAILTRAP_TOKEN not set');
  process.exit(1);
}

const body = (await readStdin()).trimEnd();
if (!body) {
  console.error('body is empty (pipe text on stdin)');
  process.exit(1);
}

// Build email payload
const payload = {
  from: { email: SENDER_EMAIL, name: SENDER_NAME },
  to: [{ email: to }],
  subject: args.subject,
  text: body,
  category: 'nanoclaw',
};

// Add attachment if provided
if (args.attach) {
  try {
    const fileData = readFileSync(args.attach);
    const base64Content = fileData.toString('base64');
    const filename = basename(args.attach);
    
    payload.attachments = [{
      content: base64Content,
      filename: filename,
      disposition: 'attachment',
      type: filename.endsWith('.epub') ? 'application/epub+zip' : 
            filename.endsWith('.pdf') ? 'application/pdf' : 
            'application/octet-stream'
    }];
  } catch (err) {
    console.error(`Failed to read attachment: ${err.message}`);
    process.exit(1);
  }
}

const res = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const detail = await res.text();
  console.error(`mailtrap ${res.status}: ${detail}`);
  process.exit(1);
}

const { message_ids } = await res.json();
console.log(`sent: ${message_ids?.[0] ?? '(no id returned)'}`);
