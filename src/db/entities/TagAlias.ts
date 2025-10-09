import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { UserTable } from './User';
import { TagTable } from './Tag';

@Entity({ name: 'tag_aliases' })
export class TagAliasTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    authorId: number;
    @ManyToOne(() => TagTable, (t) => t.aliases, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: TagTable;
}
