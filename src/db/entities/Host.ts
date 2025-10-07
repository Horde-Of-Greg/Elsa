import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, BaseEntity } from 'typeorm';
import { UserHost } from './UserHost';
import { TagHost } from './TagHost';
import { HostAlias } from './HostAlias';

@Entity({ name: 'hosts' })
export class Host extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({
        type: 'varchar',
        length: 32,
    })
    discordId: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    name: string;

    @OneToMany(() => UserHost, (uh) => uh.host)
    userHosts: UserHost[];

    @OneToMany(() => TagHost, (th) => th.host)
    tagHosts: TagHost[];

    @OneToMany(() => HostAlias, (ha) => ha.host)
    aliases: HostAlias[];
}
