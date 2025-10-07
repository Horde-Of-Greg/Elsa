import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tag } from './Tag';
import { User } from './User';
import { Host } from './Host';

export enum TagHostStatus {
    ACCEPTED,
    PENDING,
    BANNED,
}

@Entity({ name: 'tag_hosts' })
@Index(['hostId', 'tagId'], { unique: true })
export class TagHost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tagId: number;
    @ManyToOne(() => Tag, (t) => t.tagHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;

    @Column()
    hostId: number;
    @ManyToOne(() => Host, (h) => h.tagHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: Host;

    @Column({
        type: 'enum',
        enum: TagHostStatus,
        default: TagHostStatus.PENDING,
    })
    status: TagHostStatus;

    @Column({ nullable: true })
    userOverrideId: number | null;
    @ManyToOne(() => User, (u) => u.overrides, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_override_id' })
    userOverride: User | null;
}
