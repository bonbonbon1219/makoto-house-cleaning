import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const bookingStatusEnum = pgEnum("booking_status", [
  "provisional",
  "confirmed",
  "cancelled",
]);

export const bookingSlotEnum = pgEnum("booking_slot", ["am", "pm"]);

export const availabilityDay = pgTable("availability_day", {
  date: date("date", { mode: "string" }).primaryKey(),
  maxJobs: integer("max_jobs").notNull().default(2),
  amOpen: boolean("am_open").notNull().default(true),
  pmOpen: boolean("pm_open").notNull().default(true),
  closed: boolean("closed").notNull().default(false),
  note: text("note").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const booking = pgTable("booking", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: bookingStatusEnum("status").notNull().default("provisional"),
  date: date("date", { mode: "string" }).notNull(),
  slot: bookingSlotEnum("slot").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  area: varchar("area", { length: 80 }).notNull(),
  otherArea: varchar("other_area", { length: 120 }).notNull().default(""),
  service: varchar("service", { length: 200 }).notNull(),
  message: text("message").notNull().default(""),
  estimateNote: text("estimate_note").notNull().default(""),
  adminNote: text("admin_note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AvailabilityDay = typeof availabilityDay.$inferSelect;
export type Booking = typeof booking.$inferSelect;
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type BookingSlot = (typeof bookingSlotEnum.enumValues)[number];
