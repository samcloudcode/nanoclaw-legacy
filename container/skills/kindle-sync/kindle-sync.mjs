#!/usr/bin/env node
/**
 * kindle-sync.mjs — Convert a markdown note to epub and email to Kindle
 *
 * Usage:
 *   node kindle-sync.mjs --file /path/to/note.md
 *   node kindle-sync.mjs --file /path/to/note.md --title "My Note" --format pdf
 *   node kindle-sync.mjs --file /path/to/note.md --category "Health"
 *   node kindle-sync.mjs --file /path/to/note.md --no-send  # convert only, don't email
 *
 * Requires: pandoc, send-email skill
 */

import { execSync } from 'child_process';
import { readFileSync, mkdirSync } from 'fs';
import { basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) args.file = argv[++i];
    else if (argv[i] === '--title' && argv[i + 1]) args.title = argv[++i];
    else if (argv[i] === '--format' && argv[i + 1]) args.format = argv[++i];
    else if (argv[i] === '--email' && argv[i + 1]) args.email = argv[++i];
    else if (argv[i] === '--category' && argv[i + 1]) args.category = argv[++i];
    else if (argv[i] === '--no-send') args.noSend = true;
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args.file) {
  console.error('Usage: node kindle-sync.mjs --file <path> [--title <title>] [--category <cat>] [--format epub|pdf] [--email <kindle-email>] [--no-send]');
  process.exit(1);
}

const format = args.format || 'epub';
const srcName = basename(args.file, '.md');
let title = args.title || srcName;

// Add category prefix if provided
if (args.category) {
  title = `[${args.category}] ${title}`;
}

const kindleEmail = args.email || 'samstitt_toread@kindle.com';

// Output directory in vault for easy access
const outputDir = '/workspace/extra/vault/kindle-queue';
try {
  mkdirSync(outputDir, { recursive: true });
} catch (err) {
  // Directory exists, ignore
}

const outFile = join(outputDir, `${srcName}.${format}`);

// Convert markdown → epub/pdf via pandoc
console.log(`Converting ${srcName}.md to ${format}...`);
try {
  execSync(
    `pandoc "${args.file}" -o "${outFile}" --metadata title="${title.replace(/"/g, '\\"')}"`,
    { stdio: ['pipe', 'pipe', 'pipe'] }
  );
} catch (err) {
  console.error(`pandoc failed: ${err.stderr?.toString() || err.message}`);
  process.exit(1);
}

const stats = readFileSync(outFile);
const sizeKB = (stats.length / 1024).toFixed(1);

console.log(`✓ Created: ${outFile} (${sizeKB} KB)`);
if (args.category) {
  console.log(`  Category: [${args.category}]`);
}

// Send via email if not --no-send
if (!args.noSend) {
  console.log(`\nSending to ${kindleEmail}...`);
  
  try {
    const result = execSync(
      `node /home/node/.claude/skills/send-email/send-email.mjs --to "${kindleEmail}" --subject "${title}" --attach "${outFile}" <<'EOF'
Document sent from NanoClaw.

Title: ${title}
Format: ${format.toUpperCase()}
Size: ${sizeKB} KB
EOF`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    
    console.log(`✓ Sent to Kindle: ${kindleEmail}`);
    console.log(`  Message ID: ${result.trim().replace('sent: ', '')}`);
    console.log(`\nDocument will appear in your Kindle library within minutes.`);
  } catch (err) {
    console.error(`\nFailed to send email: ${err.message}`);
    console.error(`\nManual fallback:`);
    console.error(`1. Open your email client`);
    console.error(`2. Attach: ${outFile}`);
    console.error(`3. Send to: ${kindleEmail}`);
    process.exit(1);
  }
} else {
  console.log(`\nTo send to Kindle:`);
  console.log(`1. Open your email client`);
  console.log(`2. Attach: ${outFile}`);
  console.log(`3. Send to: ${kindleEmail}`);
}
