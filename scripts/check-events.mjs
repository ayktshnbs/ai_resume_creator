import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const events = await client.execute(
  "SELECT actorType, kind, outcome, delta, datetime(createdAt) as createdAt FROM UsageEvent ORDER BY createdAt DESC LIMIT 20"
);
console.log("Recent UsageEvents (newest first):");
for (const row of events.rows) {
  console.log(`  ${row.createdAt}  ${row.actorType}  ${row.kind}  outcome=${row.outcome}  delta=${row.delta}`);
}

const guests = await client.execute(
  "SELECT cookieId, resumeExports, coverLetterExports, datetime(createdAt) as createdAt FROM GuestSession ORDER BY createdAt DESC LIMIT 5"
);
console.log("\nGuestSessions:");
for (const row of guests.rows) {
  console.log(`  ${row.createdAt}  cookie=${String(row.cookieId).slice(0,8)}  resume=${row.resumeExports}  cl=${row.coverLetterExports}`);
}

process.exit(0);
