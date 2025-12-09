import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    BaseEntity,
} from 'typeorm';
import { UserTable } from './User';
import { HostTable } from './Host';

export enum PermLevel {
    DEFAULT,
    TRUSTED,
    MOD,
    ADMIN,
    OWNER,
}

@Entity({ name: 'user_hosts' })
@Index(['userId', 'hostId'], { unique: true })
export class UserHostTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: PermLevel,
        default: PermLevel.DEFAULT,
    })
    permLevel: PermLevel;

    @Column()
    userId: number;
    @ManyToOne(() => UserTable, (u) => u.userHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserTable;

    @Column()
    hostId: number;
    @ManyToOne(() => HostTable, (h) => h.userHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hostId' })
    host: HostTable;
}
