import { date, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const dayMarkEnum = pgEnum("day_mark_value", ["open", "few", "full"]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "provisional",
  "confirmed",
  "cancelled",
]);

export const dayMark = pgTable("day_mark", {
  date: date("date", { mode: "string" }).primaryKey(),
  mark: dayMarkEnum("mark").notNull().default("open"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const booking = pgTable("booking", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: bookingStatusEnum("status").notNull().default("provisional"),
  date: date("date", { mode: "string" }).notNull(),
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

export type DayMarkRow = typeof dayMark.$inferSelect;
export type Booking = typeof booking.$inferSelect;
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type MarkValue = (typeof dayMarkEnum.enumValues)[number];
