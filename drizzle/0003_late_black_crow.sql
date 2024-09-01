DO $$ BEGIN
 CREATE TYPE "public"."category_type" AS ENUM('income', 'expense');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "type" "category_type" NOT NULL;