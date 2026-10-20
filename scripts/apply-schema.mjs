import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(".env.local", "utf8");
const url = env
  .split(/\r?\n/)
  .find((line) => line.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length)
  ?.trim();

if (!url) {
  throw new Error("DATABASE_URL missing in .env.local");
}

const sql = neon(url);

const statements = [
  `ALTER TABLE "booking" ADD COLUMN IF NOT EXISTS "address" varchar(300) DEFAULT '' NOT NULL`,
];

for (const stmt of statements) {
  process.stdout.write(`RUN ${stmt.slice(0, 60).replace(/\s+/g, " ")}...\n`);
  await sql.query(stmt);
}

const tables = await sql`select tablename from pg_tables where schemaname = 'public' order by tablename`;
console.log(
  "TABLES",
  tables.map((row) => row.tablename).join(", "),
);
console.log("SCHEMA_OK");
