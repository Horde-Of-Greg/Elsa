import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tag } from './Tag';
import { TagHost } from './TagHost';

@Entity({ name: 'tag_elements' })
@Index(['name', 'tagId'], { unique: true })
export class TagElement {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        type: 'varchar',
        length: 128,
    })
    name: string;

    @Column({ type: 'text' })
    body: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    isScript: boolean;

    @Column({ nullable: true })
    tagId: number | null;
    @ManyToOne(() => Tag, (t) => t.elements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag | null;

    @Column({ nullable: true })
    tagHostId: number | null;
    @ManyToOne(() => TagHost, (th) => th.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_host_id' })
    tagHost: TagHost | null;
}
