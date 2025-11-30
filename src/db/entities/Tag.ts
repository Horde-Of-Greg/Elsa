import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { UserTable } from './User';
import { TagHostTable } from './TagHost';
import { TagOverridesTable } from './TagOverrides';
import { CategoryTagTable } from './CategoryTag';
import { TagAliasTable } from './TagAlias';
import { SHA256Hash } from '../../utils/crypto/sha256Hash';

@Entity({ name: 'tags' })
export class TagTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column({ type: 'text' })
    body: string;

    @Index({ unique: true })
    @Column({ type: 'bytea' })
    bodyHash: SHA256Hash;

    @Column({ type: 'boolean', default: false })
    isScript: boolean;

    @Column()
    authorId: number;
    @ManyToOne(() => UserTable, (u) => u.tags, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: UserTable;

    @OneToMany(() => TagHostTable, (th) => th.tag)
    tagHosts: TagHostTable[];

    @OneToMany(() => TagOverridesTable, (to) => to.tag)
    overrides: TagOverridesTable[];

    @OneToMany(() => CategoryTagTable, (ct) => ct.tag)
    categoryLinks: CategoryTagTable[];

    @OneToMany(() => TagAliasTable, (ta) => ta.tag)
    aliases: TagAliasTable[];
}
