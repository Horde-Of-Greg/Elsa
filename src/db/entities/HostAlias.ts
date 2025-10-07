// src/db/entities/HostAlias.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Host } from './Host';

@Entity({ name: 'host_aliases' })
@Index(['name', 'hostId'], { unique: true })
export class HostAlias {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        type: 'varchar',
        length: 255,
    })
    name: string;

    @Column()
    hostId: number;
    @ManyToOne(() => Host, (h) => h.aliases, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'host_id' })
    host: Host;
}
