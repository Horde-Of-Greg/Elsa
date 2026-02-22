import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { HostAliasTable } from "./HostAlias.js";
import { TagHostTable } from "./TagHost.js";
import { UserHostTable } from "./UserHost.js";

@Entity({ name: "hosts" })
export class HostTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({
        type: "varchar",
        length: 32,
    })
    discordId: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    name: string;

    @OneToMany(() => UserHostTable, (uh) => uh.host)
    userHosts: UserHostTable[];

    @OneToMany(() => TagHostTable, (th) => th.host)
    tagHosts: TagHostTable[];

    @OneToMany(() => HostAliasTable, (ha) => ha.host)
    hostAliases: HostAliasTable[];
}
