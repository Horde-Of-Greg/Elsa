import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    BaseEntity,
} from 'typeorm';
import { TagTable } from './Tag';
import { UserTable } from './User';
import { HostTable } from './Host';

export enum TagHostStatus {
    ACCEPTED,
    PENDING,
    BANNED,
}

@Entity({ name: 'tag_hosts' })
@Index(['hostId', 'tagId'], { unique: true })
export class TagHostTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.tagHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: TagTable;

    @Column()
    hostId: number;
    @ManyToOne(() => HostTable, (h) => h.tagHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: HostTable;

    @Column({
        type: 'enum',
        enum: TagHostStatus,
        default: TagHostStatus.PENDING,
    })
    status: TagHostStatus;

    @Column({ nullable: true })
    userOverrideId: number;
    @ManyToOne(() => UserTable, (u) => u.overrides, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_override_id' })
    userOverride: UserTable;
}
