import { Column, Entity, Index,JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { HostTable } from "./Host";
import { UserTable } from "./User";

export enum PermLevel {
    DEFAULT,
    TRUSTED,
    MOD,
    ADMIN,
    OWNER,
}

@Entity({ name: "user_hosts" })
@Index(["userId", "hostId"], { unique: true })
export class UserHostTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: PermLevel,
        default: PermLevel.DEFAULT,
    })
    permLevel: PermLevel;

    @Column()
    userId: number;
    @ManyToOne(() => UserTable, (u) => u.userHosts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserTable;

    @Column()
    hostId: number;
    @ManyToOne(() => HostTable, (h) => h.userHosts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hostId" })
    host: HostTable;
}
