import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Tag } from './Tag';

@Entity({ name: 'tag_aliases' })
export class TagAlias {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    authorId: number;
    @ManyToOne(() => User, (u) => u.tags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}
