// One-off script to apply a Prisma migration to a Turso/libsql database
// when `prisma migrate deploy` cannot parse the libsql:// URL.
//
// Usage: node scripts/apply-migration.mjs <migration-folder-name>
// Example: node scripts/apply-migration.mjs 20260528000000_add_usage_tracking

import { createClient } from "@libsql/client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL missing in .env.local");
  process.exit(1);
}

const migrationName = process.argv[2];
if (!migrationName) {
  console.error("Usage: node scripts/apply-migration.mjs <migration-folder>");
  process.exit(1);
}

const sqlPath = join("prisma", "migrations", migrationName, "migration.sql");
const sql = await readFile(sqlPath, "utf8");

const client = createClient({ url, authToken });

// Strip SQL comments, then split on terminating semicolons.
const stripped = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");
const statements = stripped
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Applying ${statements.length} statements from ${migrationName}...`);

for (const [i, stmt] of statements.entries()) {
  const preview = stmt.split("\n")[0].slice(0, 70);
  try {
    await client.execute(stmt);
    console.log(`  [${i + 1}/${statements.length}] ✓ ${preview}`);
  } catch (err) {
    if (/already exists|duplicate column/i.test(String(err.message))) {
      console.log(`  [${i + 1}/${statements.length}] - ${preview} (skipped, already applied)`);
      continue;
    }
    console.error(`  [${i + 1}/${statements.length}] ✗ ${preview}`);
    console.error(`    ${err.message}`);
    process.exit(1);
  }
}

// Record the migration in Prisma's _prisma_migrations table so future
// `prisma migrate status` calls stay accurate.
try {
  await client.execute({
    sql:
      "INSERT OR IGNORE INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at, applied_steps_count) VALUES (?, ?, ?, datetime('now'), datetime('now'), ?)",
    args: [
      crypto.randomUUID(),
      "manual-libsql-apply",
      migrationName,
      statements.length,
    ],
  });
} catch (err) {
  // Table may not exist yet on a fresh DB; non-fatal.
  console.log(`  (note: could not record in _prisma_migrations: ${err.message})`);
}

console.log("✓ Migration applied.");
process.exit(0);
