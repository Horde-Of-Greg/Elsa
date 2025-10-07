import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Host } from './Host';

export enum PermLevel {
    DEFAULT,
    TRUSTED,
    MOD,
    ADMIN,
    OWNER,
}

@Entity({ name: 'user_hosts' })
@Index(['userId', 'hostId'], { unique: true })
export class UserHost {
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
    @ManyToOne(() => User, (u) => u.userHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    hostId: number;
    @ManyToOne(() => Host, (h) => h.userHosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: Host;
}
