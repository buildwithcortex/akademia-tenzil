import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_applications_gjinia" AS ENUM('mashkull', 'femer');
  ALTER TABLE "payload"."applications" ADD COLUMN "gjinia" "payload"."enum_applications_gjinia";
  CREATE INDEX "applications_email_idx" ON "payload"."applications" USING btree ("email");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "payload"."applications_email_idx";
  ALTER TABLE "payload"."applications" DROP COLUMN "gjinia";
  DROP TYPE "payload"."enum_applications_gjinia";`)
}
