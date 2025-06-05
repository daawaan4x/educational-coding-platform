CREATE TYPE "public"."statuses" AS ENUM('accepted', 'wrong-answer', 'error', 'timeout', 'pending');--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "status" "statuses" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "attempt" integer;