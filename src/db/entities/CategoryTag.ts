import { Column, Entity, Index,JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CategoryTable } from "./Category";
import { TagTable } from "./Tag";

@Entity({ name: "category_tags" })
@Index(["categoryId", "tagId"], { unique: true })
export class CategoryTagTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryId: number;
    @ManyToOne(() => CategoryTable, (c) => c.links, { onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: CategoryTable;

    @Column()
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.categoryLinks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tagId" })
    tag: TagTable;
}
