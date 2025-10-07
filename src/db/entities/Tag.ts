import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { User } from './User';
import { TagHost } from './TagHost';
import { TagElement } from './TagElement';
import { CategoryTag } from './CategoryTag';
import { TagAlias } from './TagAlias';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    authorId: number;
    @ManyToOne(() => User, (u) => u.tags, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @OneToMany(() => TagHost, (th) => th.tag)
    tagHosts: TagHost[];

    @OneToMany(() => TagElement, (te) => te.tag)
    elements: TagElement[];

    @OneToMany(() => CategoryTag, (ct) => ct.tag)
    categoryLinks: CategoryTag[];

    @OneToMany(() => TagAlias, (ta) => ta.tag)
    tagAliases: TagAlias[];
}
