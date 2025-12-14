import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { TagTable } from "./Tag";

@Entity({ name: "tag_aliases" })
@Index(["name"], { unique: true })
export class TagAliasTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 128 })
    name: string;

    @Column()
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.aliases, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tagId" })
    tag: TagTable;
}
