import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!cached) {
    const sql = neon(url);
    cached = drizzle(sql, { schema });
  }

  return cached;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export { schema };
