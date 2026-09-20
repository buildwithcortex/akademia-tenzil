import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"njoftuar_me" timestamp(3) with time zone,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."application_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hapur" boolean DEFAULT true,
  	"mesazhi_mbyllur" varchar DEFAULT 'Aplikimet për këtë periudhë janë mbyllur. Lini email-in tuaj dhe do t’ju njoftojmë sapo të hapen përsëri.',
  	"njoftim_subjekti" varchar DEFAULT 'Aplikimet në Akademia Tenzil janë hapur',
  	"njoftim_teksti" varchar DEFAULT 'Të nderuar,
  
  Aplikimet në Akademia Tenzil janë hapur përsëri. Nëse dëshironi të bëheni pjesë e akademisë, mund të aplikoni tani.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "payload"."subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "payload"."subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "payload"."subscribers" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "payload"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("subscribers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."subscribers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."application_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."subscribers" CASCADE;
  DROP TABLE "payload"."application_settings" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscribers_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_subscribers_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "subscribers_id";`)
}
