import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, BaseEntity } from 'typeorm';
import { UserHostTable } from './UserHost';
import { TagTable } from './Tag';
import { TagHostTable } from './TagHost';

@Entity({ name: 'users' })
export class UserTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 32 })
    discordId: string;

    @OneToMany(() => UserHostTable, (uh) => uh.user)
    userHosts: UserHostTable[];

    @OneToMany(() => TagTable, (t) => t.author)
    tags: TagTable[];

    @OneToMany(() => TagHostTable, (th) => th.userOverride)
    overrides: TagHostTable[];
}
