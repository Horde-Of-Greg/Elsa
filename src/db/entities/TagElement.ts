import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    BaseEntity,
} from 'typeorm';
import { TagTable } from './Tag';
import { TagHostTable } from './TagHost';

@Entity({ name: 'tag_elements' })
@Index(['name', 'tagId'], { unique: true })
export class TagElementTable {
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
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.elements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: TagTable;

    @Column({ nullable: true })
    tagHostId: number;
    @ManyToOne(() => TagHostTable, (th) => th.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_host_id' })
    tagHost: TagHostTable;
}
