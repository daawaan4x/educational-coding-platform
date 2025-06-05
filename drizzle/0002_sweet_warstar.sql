CREATE TYPE "public"."languages" AS ENUM('c', 'cpp', 'py', 'java', 'js', 'ts', 'php');--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "language" "languages" DEFAULT 'js' NOT NULL;