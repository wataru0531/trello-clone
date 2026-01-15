import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1748999592268 implements MigrationInterface {
    name = 'Generate1748999592268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "position" integer NOT NULL, "dueDate" datetime, "userId" varchar NOT NULL, "listId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "position" integer NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "board_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad" ON "board_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5114ab9d85990d8fd6f06aab7c" ON "board_user" ("boardId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "thumbnailUrl" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "temporary_card" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "position" integer NOT NULL, "dueDate" datetime, "userId" varchar NOT NULL, "listId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_card"("id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt") SELECT "id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt" FROM "card"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`ALTER TABLE "temporary_card" RENAME TO "card"`);
        await queryRunner.query(`CREATE TABLE "temporary_list" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "position" integer NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_bbb2794eef8a900448a5f487eb5" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_list"("id", "title", "position", "boardId", "createdAt", "updatedAt") SELECT "id", "title", "position", "boardId", "createdAt", "updatedAt" FROM "list"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`ALTER TABLE "temporary_list" RENAME TO "list"`);
        await queryRunner.query(`DROP INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad"`);
        await queryRunner.query(`DROP INDEX "IDX_5114ab9d85990d8fd6f06aab7c"`);
        await queryRunner.query(`CREATE TABLE "temporary_board_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ceb5e4fbf8e8fe5419b2bcf8adc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5114ab9d85990d8fd6f06aab7c6" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_board_user"("id", "userId", "boardId", "createdAt") SELECT "id", "userId", "boardId", "createdAt" FROM "board_user"`);
        await queryRunner.query(`DROP TABLE "board_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_board_user" RENAME TO "board_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad" ON "board_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5114ab9d85990d8fd6f06aab7c" ON "board_user" ("boardId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5114ab9d85990d8fd6f06aab7c"`);
        await queryRunner.query(`DROP INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad"`);
        await queryRunner.query(`ALTER TABLE "board_user" RENAME TO "temporary_board_user"`);
        await queryRunner.query(`CREATE TABLE "board_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "board_user"("id", "userId", "boardId", "createdAt") SELECT "id", "userId", "boardId", "createdAt" FROM "temporary_board_user"`);
        await queryRunner.query(`DROP TABLE "temporary_board_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_5114ab9d85990d8fd6f06aab7c" ON "board_user" ("boardId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad" ON "board_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "list" RENAME TO "temporary_list"`);
        await queryRunner.query(`CREATE TABLE "list" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "position" integer NOT NULL, "boardId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "list"("id", "title", "position", "boardId", "createdAt", "updatedAt") SELECT "id", "title", "position", "boardId", "createdAt", "updatedAt" FROM "temporary_list"`);
        await queryRunner.query(`DROP TABLE "temporary_list"`);
        await queryRunner.query(`ALTER TABLE "card" RENAME TO "temporary_card"`);
        await queryRunner.query(`CREATE TABLE "card" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "position" integer NOT NULL, "dueDate" datetime, "userId" varchar NOT NULL, "listId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "card"("id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt") SELECT "id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt" FROM "temporary_card"`);
        await queryRunner.query(`DROP TABLE "temporary_card"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "IDX_5114ab9d85990d8fd6f06aab7c"`);
        await queryRunner.query(`DROP INDEX "IDX_ceb5e4fbf8e8fe5419b2bcf8ad"`);
        await queryRunner.query(`DROP TABLE "board_user"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "card"`);
    }

}
