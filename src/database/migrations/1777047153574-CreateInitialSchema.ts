import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1777047153574 implements MigrationInterface {
  name = 'CreateInitialSchema1777047153574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "session_id" uuid NOT NULL, "question_id" integer NOT NULL, "step" integer NOT NULL, "tested_level" integer NOT NULL, "value" character varying(100) NOT NULL, "passed" boolean NOT NULL, "floor_after" integer NOT NULL, "ceiling_after" integer NOT NULL, "answered_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_20be42b43a647851511dd1ac06" ON "answers" ("session_id", "step") `,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "declared_level" integer NOT NULL, "floor" integer NOT NULL, "ceiling" integer NOT NULL, "current_level" integer NOT NULL, "max_level" integer NOT NULL DEFAULT '6', "questions_per_level" integer NOT NULL DEFAULT '7', "current_level_answered" integer NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'in_progress', "final_level" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "levels" ("id" SERIAL NOT NULL, "level_index" integer NOT NULL, "name" character varying(120) NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_49c3299f45b23b027fa675ffea" ON "levels" ("level_index") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_question_type_enum" AS ENUM('BOOLEAN', 'SCALE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "level_id" integer NOT NULL, "text" text NOT NULL, "question_type" "public"."questions_question_type_enum" NOT NULL DEFAULT 'BOOLEAN', "order_in_level" integer NOT NULL, "options" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e78cbd7063a9ed439ca92be1ae" ON "questions" ("level_id", "order_in_level") `,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_505280e8f8b52877fd4565e30b3" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_505280e8f8b52877fd4565e30b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e78cbd7063a9ed439ca92be1ae"`,
    );
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(
      `DROP TYPE "public"."questions_question_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49c3299f45b23b027fa675ffea"`,
    );
    await queryRunner.query(`DROP TABLE "levels"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20be42b43a647851511dd1ac06"`,
    );
    await queryRunner.query(`DROP TABLE "answers"`);
  }
}
