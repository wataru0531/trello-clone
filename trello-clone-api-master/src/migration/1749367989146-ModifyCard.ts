import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyCard1749367989146 implements MigrationInterface {
    name = 'ModifyCard1749367989146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_card" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "position" integer NOT NULL, "dueDate" datetime, "userId" varchar NOT NULL, "listId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "completed" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_card"("id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt") SELECT "id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt" FROM "card"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`ALTER TABLE "temporary_card" RENAME TO "card"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" RENAME TO "temporary_card"`);
        await queryRunner.query(`CREATE TABLE "card" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text, "position" integer NOT NULL, "dueDate" datetime, "userId" varchar NOT NULL, "listId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_4267e15872bbabeb7d9c0448ca0" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "card"("id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt") SELECT "id", "title", "description", "position", "dueDate", "userId", "listId", "createdAt", "updatedAt" FROM "temporary_card"`);
        await queryRunner.query(`DROP TABLE "temporary_card"`);
    }

}
