CREATE TYPE "public"."booking_status" AS ENUM('provisional', 'confirmed', 'cancelled');
CREATE TYPE "public"."booking_slot" AS ENUM('am', 'pm');

CREATE TABLE IF NOT EXISTS "availability_day" (
  "date" date PRIMARY KEY NOT NULL,
  "max_jobs" integer DEFAULT 2 NOT NULL,
  "am_open" boolean DEFAULT true NOT NULL,
  "pm_open" boolean DEFAULT true NOT NULL,
  "closed" boolean DEFAULT false NOT NULL,
  "note" text DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "booking" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "status" "booking_status" DEFAULT 'provisional' NOT NULL,
  "date" date NOT NULL,
  "slot" "booking_slot" NOT NULL,
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
