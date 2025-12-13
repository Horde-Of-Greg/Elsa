import { Column, Entity, Index,OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { TagTable } from "./Tag";
import { TagOverridesTable } from "./TagOverrides";
import { UserHostTable } from "./UserHost";

@Entity({ name: "users" })
export class UserTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 32 })
    discordId: string;

    @Column({ type: "varchar", length: 64, nullable: true, default: "Unknown" })
    name: string | null;

    @OneToMany(() => UserHostTable, (uh) => uh.user)
    userHosts: UserHostTable[];

    @OneToMany(() => TagTable, (t) => t.author)
    tags: TagTable[];

    @OneToMany(() => TagOverridesTable, (to) => to.authorOverride)
    tagOverrides: TagOverridesTable[];
}
