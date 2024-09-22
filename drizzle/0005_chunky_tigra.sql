CREATE TABLE IF NOT EXISTS "chart_layout" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"state" jsonb NOT NULL
);
