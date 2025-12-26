import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1766770148746 implements MigrationInterface {
    name = "InitialSchema1766770148746";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "host_aliases" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "hostId" integer NOT NULL, CONSTRAINT "PK_85e2d86aafe70b89972c2f4a185" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_613cdb20ac70df414ec261e7f9" ON "host_aliases" ("name", "hostId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(32) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `,
        );
        await queryRunner.query(
            `CREATE TABLE "category_tags" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_18a3eaf58525b74cc98bbd84419" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_88949863a837078633379b23b6" ON "category_tags" ("categoryId", "tagId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "tag_aliases" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_84d1347dcf0a8d46d91180295f8" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_a2d58ae043f0463b7086bd576f" ON "tag_aliases" ("name") `,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "discordId" character varying(32) NOT NULL, "name" character varying(64) DEFAULT 'Unknown', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_ae4a93a6b25195ccc2a97e13f0" ON "users" ("discordId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "tag_elements" ("id" SERIAL NOT NULL, "body" text, "isScript" boolean, "tagId" integer NOT NULL, "tagHostId" integer NOT NULL, "authorOverrideId" integer, CONSTRAINT "UQ_4ba1625a16a57fccf1623143ac8" UNIQUE ("tagHostId"), CONSTRAINT "PK_71617bd40869c2036b46576a33c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_4ba1625a16a57fccf1623143ac" ON "tag_elements" ("tagHostId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(128) NOT NULL, "body" text NOT NULL, "bodyHash" bytea NOT NULL, "isScript" boolean NOT NULL DEFAULT false, "authorId" integer NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d90243459a697eadb8ad56e909" ON "tags" ("name") `);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_6daf35de7c131a1f6a21f0c681" ON "tags" ("bodyHash") `,
        );
        await queryRunner.query(`CREATE TYPE "public"."tag_hosts_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(
            `CREATE TABLE "tag_hosts" ("id" SERIAL NOT NULL, "tagId" integer NOT NULL, "hostId" integer NOT NULL, "status" "public"."tag_hosts_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_4c11ab1bdd6e33cca22d4b90004" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_c33c77973b6fb9ef1cc7a54c32" ON "tag_hosts" ("hostId", "tagId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "hosts" ("id" SERIAL NOT NULL, "discordId" character varying(32) NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_c4bcf0826e0e2847faee4da1746" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_5f7b0a433330d80ae7b917b5e4" ON "hosts" ("discordId") `,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."user_hosts_permlevel_enum" AS ENUM('0', '1', '2', '3', '4')`,
        );
        await queryRunner.query(
            `CREATE TABLE "user_hosts" ("id" SERIAL NOT NULL, "permLevel" "public"."user_hosts_permlevel_enum" NOT NULL DEFAULT '0', "userId" integer NOT NULL, "hostId" integer NOT NULL, CONSTRAINT "PK_a23422e2faca1a750488cfb7d5c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_df10ab5eb09d8b593c474acf51" ON "user_hosts" ("userId", "hostId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "host_aliases" ADD CONSTRAINT "FK_94f1a1d5bfb6f857a8d7dd0ea4e" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_tags" ADD CONSTRAINT "FK_fa301e1dbeced9eac583e6bfc17" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_tags" ADD CONSTRAINT "FK_2d09f120eb5bb2b15592d2ec8cd" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_aliases" ADD CONSTRAINT "FK_c9a49b10c76e483b017b2b018ec" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_elements" ADD CONSTRAINT "FK_016a544abfa6639e8f1d743188d" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_elements" ADD CONSTRAINT "FK_4ba1625a16a57fccf1623143ac8" FOREIGN KEY ("tagHostId") REFERENCES "tag_hosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_elements" ADD CONSTRAINT "FK_6aa9ffbf1758632617a5c535d43" FOREIGN KEY ("authorOverrideId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tags" ADD CONSTRAINT "FK_289e8773b885864afa627239c8f" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_hosts" ADD CONSTRAINT "FK_4dd6f4c64536bd24fbcc9fa0220" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_hosts" ADD CONSTRAINT "FK_bbe2bd399cf5a4998b1272d269a" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_hosts" ADD CONSTRAINT "FK_bc098f20f5ba8659061bcbcdbd6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_hosts" ADD CONSTRAINT "FK_82fc3a60994f96108a837802a61" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_hosts" DROP CONSTRAINT "FK_82fc3a60994f96108a837802a61"`);
        await queryRunner.query(`ALTER TABLE "user_hosts" DROP CONSTRAINT "FK_bc098f20f5ba8659061bcbcdbd6"`);
        await queryRunner.query(`ALTER TABLE "tag_hosts" DROP CONSTRAINT "FK_bbe2bd399cf5a4998b1272d269a"`);
        await queryRunner.query(`ALTER TABLE "tag_hosts" DROP CONSTRAINT "FK_4dd6f4c64536bd24fbcc9fa0220"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_289e8773b885864afa627239c8f"`);
        await queryRunner.query(
            `ALTER TABLE "tag_elements" DROP CONSTRAINT "FK_6aa9ffbf1758632617a5c535d43"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_elements" DROP CONSTRAINT "FK_4ba1625a16a57fccf1623143ac8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag_elements" DROP CONSTRAINT "FK_016a544abfa6639e8f1d743188d"`,
        );
        await queryRunner.query(`ALTER TABLE "tag_aliases" DROP CONSTRAINT "FK_c9a49b10c76e483b017b2b018ec"`);
        await queryRunner.query(
            `ALTER TABLE "category_tags" DROP CONSTRAINT "FK_2d09f120eb5bb2b15592d2ec8cd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_tags" DROP CONSTRAINT "FK_fa301e1dbeced9eac583e6bfc17"`,
        );
        await queryRunner.query(
            `ALTER TABLE "host_aliases" DROP CONSTRAINT "FK_94f1a1d5bfb6f857a8d7dd0ea4e"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_df10ab5eb09d8b593c474acf51"`);
        await queryRunner.query(`DROP TABLE "user_hosts"`);
        await queryRunner.query(`DROP TYPE "public"."user_hosts_permlevel_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f7b0a433330d80ae7b917b5e4"`);
        await queryRunner.query(`DROP TABLE "hosts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c33c77973b6fb9ef1cc7a54c32"`);
        await queryRunner.query(`DROP TABLE "tag_hosts"`);
        await queryRunner.query(`DROP TYPE "public"."tag_hosts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6daf35de7c131a1f6a21f0c681"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d90243459a697eadb8ad56e909"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ba1625a16a57fccf1623143ac"`);
        await queryRunner.query(`DROP TABLE "tag_elements"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae4a93a6b25195ccc2a97e13f0"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2d58ae043f0463b7086bd576f"`);
        await queryRunner.query(`DROP TABLE "tag_aliases"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88949863a837078633379b23b6"`);
        await queryRunner.query(`DROP TABLE "category_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_613cdb20ac70df414ec261e7f9"`);
        await queryRunner.query(`DROP TABLE "host_aliases"`);
    }
}
