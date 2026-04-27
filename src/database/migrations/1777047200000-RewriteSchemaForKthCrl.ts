import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Replaces the original prototype schema with the KTH IRL schema (CRL dimension).
 * Drops the old tables/types entirely; this is a hard reset of the prototype data.
 */
export class RewriteSchemaForKthCrl1777047200000 implements MigrationInterface {
  name = 'RewriteSchemaForKthCrl1777047200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop everything from the old schema.
    await queryRunner.query(`DROP TABLE IF EXISTS "answers" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "questions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "levels" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sessions" CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."questions_question_type_enum"`,
    );

    // Levels: one row per (dimension, level_index).
    await queryRunner.query(
      `CREATE TABLE "levels" (
        "id" SERIAL NOT NULL,
        "dimension" character varying(10) NOT NULL DEFAULT 'CRL',
        "level_index" integer NOT NULL,
        "name" character varying(120) NOT NULL,
        "description" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_levels" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_levels_dimension_index" ON "levels" ("dimension", "level_index")`,
    );

    // Questions = affirmatives. Binary by construction; no options/type column.
    await queryRunner.query(
      `CREATE TABLE "questions" (
        "id" SERIAL NOT NULL,
        "level_id" integer NOT NULL,
        "text" text NOT NULL,
        "order_in_level" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_questions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_questions_level"
          FOREIGN KEY ("level_id") REFERENCES "levels"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_questions_level_order" ON "questions" ("level_id", "order_in_level")`,
    );

    // Sessions: search/roadmap/completed phases, no questions_per_level.
    await queryRunner.query(
      `CREATE TABLE "sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "declared_level" integer NOT NULL,
        "max_level" integer NOT NULL DEFAULT 9,
        "floor" integer NOT NULL,
        "ceiling" integer NOT NULL,
        "current_level" integer NOT NULL,
        "current_level_answered" integer NOT NULL DEFAULT 0,
        "roadmap_level" integer,
        "roadmap_answered" integer NOT NULL DEFAULT 0,
        "phase" character varying(20) NOT NULL DEFAULT 'search',
        "final_level" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sessions" PRIMARY KEY ("id")
      )`,
    );

    // Answers: idempotent per (session, question). Phase snapshot for trajectory.
    await queryRunner.query(
      `CREATE TABLE "answers" (
        "id" SERIAL NOT NULL,
        "session_id" uuid NOT NULL,
        "question_id" integer NOT NULL,
        "step" integer NOT NULL,
        "tested_level" integer NOT NULL,
        "phase_at_answer" character varying(20) NOT NULL,
        "passed" boolean NOT NULL,
        "floor_after" integer NOT NULL,
        "ceiling_after" integer NOT NULL,
        "answered_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_answers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_answers_session"
          FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_answers_question"
          FOREIGN KEY ("question_id") REFERENCES "questions"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_answers_session_question" ON "answers" ("session_id", "question_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "answers" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sessions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "questions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "levels" CASCADE`);
  }
}
