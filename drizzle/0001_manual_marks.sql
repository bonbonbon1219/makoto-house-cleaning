DROP TABLE IF EXISTS "booking" CASCADE;
DROP TABLE IF EXISTS "availability_day" CASCADE;
DROP TABLE IF EXISTS "day_mark" CASCADE;
DROP TYPE IF EXISTS "public"."booking_slot" CASCADE;
DROP TYPE IF EXISTS "public"."day_mark_value" CASCADE;

DO $$ BEGIN
  CREATE TYPE "public"."booking_status" AS ENUM('provisional', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."day_mark_value" AS ENUM('open', 'few', 'full');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "day_mark" (
  "date" date PRIMARY KEY NOT NULL,
  "mark" "day_mark_value" DEFAULT 'open' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "booking" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "status" "booking_status" DEFAULT 'provisional' NOT NULL,
  "date" date NOT NULL,
  "name" varchar(120) NOT NULL,
  "phone" varchar(40) NOT NULL,
  "email" varchar(200) NOT NULL,
  "area" varchar(80) NOT NULL,
  "other_area" varchar(120) DEFAULT '' NOT NULL,
  "service" varchar(200) NOT NULL,
  "message" text DEFAULT '' NOT NULL,
  "estimate_note" text DEFAULT '' NOT NULL,
  "admin_note" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "booking_date_status_idx" ON "booking" ("date", "status");
