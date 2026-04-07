import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, pbkdf2Sync, createCipheriv } from "node:crypto";

const POSTS_DIR = join(import.meta.dirname, "..", "src", "posts");
const DRAFT_KEY = process.env.DRAFT_KEY;

if (!DRAFT_KEY) {
  console.log("DRAFT_KEY not set; skipping seal.");
  process.exit(0);
}

const files = readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));
let sealed = 0;

for (const file of files) {
  const filepath = join(POSTS_DIR, file);
  const raw = readFileSync(filepath, "utf8").replace(/\r\n/g, "\n");

  const match = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!match) continue;

  const [, frontmatter, body] = match;
  if (!/^draft:\s*true$/m.test(frontmatter)) continue;
  if (body.trimStart().startsWith("<!--SEALED:")) continue;
  if (!body.trim()) continue;

  const salt = randomBytes(16);
  const key = pbkdf2Sync(DRAFT_KEY, salt, 100000, 32, "sha256");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);

  const payload = JSON.stringify({
    s: salt.toString("base64"),
    i: iv.toString("base64"),
    t: cipher.getAuthTag().toString("base64"),
    d: encrypted.toString("base64"),
  });

  writeFileSync(filepath, `${frontmatter}<!--SEALED:${payload}-->\n`);
  sealed++;
  console.log(`Sealed: ${file}`);
}

console.log(`Sealed ${sealed} draft(s).`);
