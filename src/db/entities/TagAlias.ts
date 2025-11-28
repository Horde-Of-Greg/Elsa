import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { TagTable } from './Tag';
import { HostTable } from './Host';

@Entity({ name: 'tag_aliases' })
@Index(['name'], { unique: true })
export class TagAliasTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column()
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.aliases, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: TagTable;
}
