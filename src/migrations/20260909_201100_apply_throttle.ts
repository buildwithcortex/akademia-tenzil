import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hand-written: this table is not a Payload collection, so migrate:create will
 * never generate or touch it. It backs src/lib/applyThrottle.ts.
 *
 * One row per hashed address, upserted atomically. Rows are swept by the
 * throttle itself once they fall outside the window, so the table stays tiny.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."apply_throttle" (
  	"key" varchar(64) PRIMARY KEY NOT NULL,
  	"hits" integer DEFAULT 1 NOT NULL,
  	"window_start" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "apply_throttle_window_start_idx" ON "payload"."apply_throttle" USING btree ("window_start");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."apply_throttle";`)
}
