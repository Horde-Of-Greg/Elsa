import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { UserTable } from './User';
import { TagHostTable } from './TagHost';
import { TagElementTable } from './TagElement';
import { CategoryTagTable } from './CategoryTag';
import { TagAliasTable } from './TagAlias';

@Entity({ name: 'tags' })
export class TagTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    authorId: number;
    @ManyToOne(() => UserTable, (u) => u.tags, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: UserTable;

    @OneToMany(() => TagHostTable, (th) => th.tag)
    tagHosts: TagHostTable[];

    @OneToMany(() => TagElementTable, (te) => te.tag)
    elements: TagElementTable[];

    @OneToMany(() => CategoryTagTable, (ct) => ct.tag)
    categoryLinks: CategoryTagTable[];

    @OneToMany(() => TagAliasTable, (ta) => ta.tag)
    aliases: TagAliasTable[];
}
