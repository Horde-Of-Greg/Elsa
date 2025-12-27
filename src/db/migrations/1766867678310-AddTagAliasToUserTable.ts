import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagAliasToUserTable1766867678310 implements MigrationInterface {
    name = 'AddTagAliasToUserTable1766867678310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_aliases" DROP CONSTRAINT "FK_2da8517e9782823755af1b7d5fd"`);
        await queryRunner.query(`ALTER TABLE "tag_aliases" DROP COLUMN "aliasId"`);
        await queryRunner.query(`ALTER TABLE "tag_aliases" ADD CONSTRAINT "FK_29e9e47fc49f0871ac4425b9af1" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_aliases" DROP CONSTRAINT "FK_29e9e47fc49f0871ac4425b9af1"`);
        await queryRunner.query(`ALTER TABLE "tag_aliases" ADD "aliasId" integer`);
        await queryRunner.query(`ALTER TABLE "tag_aliases" ADD CONSTRAINT "FK_2da8517e9782823755af1b7d5fd" FOREIGN KEY ("aliasId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
