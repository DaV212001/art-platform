import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1782338305626 implements MigrationInterface {
    name = 'InitialSchema1782338305626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "display_name" character varying, "avatar_url" character varying, "password_hash" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "credit_balance" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "is_admin" boolean NOT NULL DEFAULT false, "email_verification_token" character varying, "password_reset_token" character varying, "password_reset_expires" TIMESTAMP WITH TIME ZONE, "refresh_token_hash" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "credit_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "amount" integer NOT NULL, "transaction_type" text NOT NULL, "reference_id" uuid, "reference_type" text, "notes" text, "balance_after" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a408319811d1ab32832ec86fc2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_credit_tx_user" ON "credit_transactions"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_credit_tx_reference" ON "credit_transactions"  ("reference_id") `);
        await queryRunner.query(`CREATE TABLE "skill_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "icon_name" character varying, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a99e73db7d2fec4b5ce365029dc" UNIQUE ("name"), CONSTRAINT "UQ_4e2223ce569333e14f484f96f58" UNIQUE ("slug"), CONSTRAINT "PK_efce364bf7be7b92b7d7f948663" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "skill_category_id" uuid NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "difficulty" text NOT NULL, "estimated_minutes" integer, "specific_goals" jsonb NOT NULL DEFAULT '[]', "tags" text array NOT NULL DEFAULT '{}', "is_published" boolean NOT NULL DEFAULT false, "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_exercises_skill_category" ON "exercises"  ("skill_category_id") `);
        await queryRunner.query(`CREATE INDEX "idx_exercises_difficulty" ON "exercises"  ("difficulty") `);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" text NOT NULL, "title" text NOT NULL, "body" text, "metadata" jsonb NOT NULL DEFAULT '{}', "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_notifications_user_unread" ON "notifications"  ("user_id") WHERE "is_read" = false`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reporter_id" uuid NOT NULL, "target_type" text NOT NULL, "target_id" character varying NOT NULL, "reason" text NOT NULL, "details" text, "status" text NOT NULL DEFAULT 'open', "resolved_by" uuid, "resolved_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "exercise_id" uuid NOT NULL, "user_id" uuid NOT NULL, "chain_id" character varying NOT NULL, "version_number" integer NOT NULL DEFAULT '1', "image_url" character varying NOT NULL, "image_thumbnail_url" character varying, "notes" text, "status" text NOT NULL DEFAULT 'pending_review', "review_requested_at" TIMESTAMP WITH TIME ZONE, "credits_spent" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_400daa0bf4590b885003c57d767" UNIQUE ("chain_id", "version_number"), CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_submissions_exercise" ON "submissions"  ("exercise_id") `);
        await queryRunner.query(`CREATE INDEX "idx_submissions_user" ON "submissions"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_submissions_chain" ON "submissions"  ("chain_id") `);
        await queryRunner.query(`CREATE INDEX "idx_submissions_status" ON "submissions"  ("status") `);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submission_id" uuid NOT NULL, "reviewer_id" uuid NOT NULL, "what_is_working" text NOT NULL, "specific_issue" text NOT NULL, "evidence" text NOT NULL, "concrete_suggestion" text NOT NULL, "additional_notes" text, "status" text NOT NULL DEFAULT 'draft', "helpfulness_rating" text, "rated_at" TIMESTAMP WITH TIME ZONE, "credits_earned" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ce3960ab290fab9cbd1b223562d" UNIQUE ("submission_id", "reviewer_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_reviews_submission" ON "reviews"  ("submission_id") `);
        await queryRunner.query(`CREATE INDEX "idx_reviews_reviewer" ON "reviews"  ("reviewer_id") `);
        await queryRunner.query(`CREATE INDEX "idx_reviews_status" ON "reviews"  ("status") `);
        await queryRunner.query(`CREATE TABLE "reputation_scores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "skill_category_id" uuid NOT NULL, "score" numeric(5,2) NOT NULL DEFAULT '50', "total_reviews" integer NOT NULL DEFAULT '0', "helpful_count" integer NOT NULL DEFAULT '0', "neutral_count" integer NOT NULL DEFAULT '0', "unhelpful_count" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f776accab1c5fb200358a6efa40" UNIQUE ("user_id", "skill_category_id"), CONSTRAINT "PK_8f98f0be15cb4551189f9c19d89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_reputation_user" ON "reputation_scores"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "credit_transactions" ADD CONSTRAINT "FK_9ac41a5292ef4d8356a86be30c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercises" ADD CONSTRAINT "FK_299df2f420a31aab73654b81aab" FOREIGN KEY ("skill_category_id") REFERENCES "skill_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercises" ADD CONSTRAINT "FK_04f0913a3334b245234bd6d3479" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_9459b9bf907a3807ef7143d2ead" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_f25cc2ef74e4af1f62f2b2b3690" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_15209c4c955c85ecc94daebea9f" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_92e950a2513a79bb3fab273c92e" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reputation_scores" ADD CONSTRAINT "FK_6c3fa63ecb9c11a6926de1e71e1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reputation_scores" ADD CONSTRAINT "FK_87852725070ba9ce5b8600b1677" FOREIGN KEY ("skill_category_id") REFERENCES "skill_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reputation_scores" DROP CONSTRAINT "FK_87852725070ba9ce5b8600b1677"`);
        await queryRunner.query(`ALTER TABLE "reputation_scores" DROP CONSTRAINT "FK_6c3fa63ecb9c11a6926de1e71e1"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_92e950a2513a79bb3fab273c92e"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_15209c4c955c85ecc94daebea9f"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_f25cc2ef74e4af1f62f2b2b3690"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_9459b9bf907a3807ef7143d2ead"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_04f0913a3334b245234bd6d3479"`);
        await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_299df2f420a31aab73654b81aab"`);
        await queryRunner.query(`ALTER TABLE "credit_transactions" DROP CONSTRAINT "FK_9ac41a5292ef4d8356a86be30c2"`);
        await queryRunner.query(`DROP INDEX "public"."idx_reputation_user"`);
        await queryRunner.query(`DROP TABLE "reputation_scores"`);
        await queryRunner.query(`DROP INDEX "public"."idx_reviews_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_reviews_reviewer"`);
        await queryRunner.query(`DROP INDEX "public"."idx_reviews_submission"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP INDEX "public"."idx_submissions_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_submissions_chain"`);
        await queryRunner.query(`DROP INDEX "public"."idx_submissions_user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_submissions_exercise"`);
        await queryRunner.query(`DROP TABLE "submissions"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP INDEX "public"."idx_notifications_user_unread"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP INDEX "public"."idx_exercises_difficulty"`);
        await queryRunner.query(`DROP INDEX "public"."idx_exercises_skill_category"`);
        await queryRunner.query(`DROP TABLE "exercises"`);
        await queryRunner.query(`DROP TABLE "skill_categories"`);
        await queryRunner.query(`DROP INDEX "public"."idx_credit_tx_reference"`);
        await queryRunner.query(`DROP INDEX "public"."idx_credit_tx_user"`);
        await queryRunner.query(`DROP TABLE "credit_transactions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
