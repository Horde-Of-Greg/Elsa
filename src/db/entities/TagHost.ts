import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { TagTable } from './Tag';
import { HostTable } from './Host';
import { TagOverridesTable } from './TagOverrides';

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
    @JoinColumn({ name: 'tagId' })
    tag: TagTable;

    @Column()
    hostId: number;
    @ManyToOne(() => HostTable, (h) => h.tagHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hostId' })
    host: HostTable;

    @Column({
        type: 'enum',
        enum: TagHostStatus,
        default: TagHostStatus.PENDING,
    })
    status: TagHostStatus;

    @OneToOne(() => TagOverridesTable, (to) => to.tagHost, { nullable: true })
    override: TagOverridesTable | null;
}
