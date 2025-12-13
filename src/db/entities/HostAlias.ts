import { Column, Entity, Index,JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { HostTable } from "./Host";

@Entity({ name: "host_aliases" })
@Index(["name", "hostId"], { unique: true })
export class HostAliasTable {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    name: string;

    @Column()
    hostId: number;
    @ManyToOne(() => HostTable, (h) => h.hostAliases, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hostId" })
    host: HostTable;
}
