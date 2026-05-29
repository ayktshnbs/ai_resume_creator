import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const user = await client.execute("PRAGMA table_info('User')");
console.log("User columns:");
user.rows.forEach((r) => console.log(`  ${r.name} ${r.type}${r.notnull ? ' NOT NULL' : ''}`));

const tables = await client.execute(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
);
console.log("\nTables:");
tables.rows.forEach((r) => console.log(`  ${r.name}`));

const guest = await client.execute("PRAGMA table_info('GuestSession')");
console.log("\nGuestSession columns:");
guest.rows.forEach((r) => console.log(`  ${r.name} ${r.type}`));

const usage = await client.execute("PRAGMA table_info('UsageEvent')");
console.log("\nUsageEvent columns:");
usage.rows.forEach((r) => console.log(`  ${r.name} ${r.type}`));

process.exit(0);
