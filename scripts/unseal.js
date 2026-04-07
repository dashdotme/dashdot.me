import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pbkdf2Sync, createDecipheriv } from "node:crypto";

const POSTS_DIR = join(import.meta.dirname, "..", "src", "posts");
const DRAFT_KEY = process.env.DRAFT_KEY;

if (!DRAFT_KEY) {
  console.log("DRAFT_KEY not set; sealed drafts will remain sealed.");
  process.exit(0);
}

const files = readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));
let unsealed = 0;

for (const file of files) {
  const filepath = join(POSTS_DIR, file);
  const raw = readFileSync(filepath, "utf8").replace(/\r\n/g, "\n");

  const match = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!match) continue;

  const [, frontmatter, body] = match;
  if (!/^draft:\s*true$/m.test(frontmatter)) continue;

  const sealedMatch = body.trim().match(/^<!--SEALED:([\s\S]*?)-->$/);
  if (!sealedMatch) continue;

  let enc;
  try {
    enc = JSON.parse(sealedMatch[1]);
  } catch {
    console.error(`Failed to parse sealed data in ${file}; skipping.`);
    continue;
  }

  try {
    const salt = Buffer.from(enc.s, "base64");
    const iv = Buffer.from(enc.i, "base64");
    const tag = Buffer.from(enc.t, "base64");
    const data = Buffer.from(enc.d, "base64");

    const key = pbkdf2Sync(DRAFT_KEY, salt, 100000, 32, "sha256");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    writeFileSync(filepath, `${frontmatter}${decrypted.toString("utf8")}`);
    unsealed++;
    console.log(`Unsealed: ${file}`);
  } catch (err) {
    console.error(`Failed to decrypt ${file}: ${err.message}. Wrong DRAFT_KEY?`);
  }
}

console.log(`Unsealed ${unsealed} draft(s).`);
