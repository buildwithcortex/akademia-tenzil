import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_applications_status" AS ENUM('i_ri', 'ne_shqyrtim', 'kontaktuar', 'pranuar', 'refuzuar');
  CREATE TABLE "payload"."applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "payload"."enum_applications_status" DEFAULT 'i_ri',
  	"shenime" varchar,
  	"emri" varchar NOT NULL,
  	"mosha" varchar,
  	"email" varchar NOT NULL,
  	"telefoni" varchar,
  	"programi" varchar,
  	"pervoja" varchar,
  	"mesazhi" varchar,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "applications_id" integer;
  CREATE INDEX "applications_updated_at_idx" ON "payload"."applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "payload"."applications" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "payload"."applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("applications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."applications" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_applications_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_applications_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "applications_id";
  DROP TYPE "payload"."enum_applications_status";`)
}
