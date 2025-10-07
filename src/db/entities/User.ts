import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, BaseEntity } from 'typeorm';
import { UserHost } from './UserHost';
import { Tag } from './Tag';
import { TagHost } from './TagHost';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 32 })
    discordId: string;

    @OneToMany(() => UserHost, (uh) => uh.user)
    userHosts: UserHost[];

    @OneToMany(() => Tag, (t) => t.author)
    tags: Tag[];

    @OneToMany(() => TagHost, (th) => th.userOverride)
    overrides: TagHost[];
}
