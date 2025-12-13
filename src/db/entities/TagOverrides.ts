import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { TagTable } from "./Tag";
import { TagHostTable } from "./TagHost";
import { UserTable } from "./User";

@Entity({ name: "tag_elements" })
@Index(["tagHostId"], { unique: true })
export class TagOverridesTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text", nullable: true })
    body: string | null;

    @Column({ type: "boolean", nullable: true })
    isScript: boolean | null;

    @Column()
    tagId: number;
    @ManyToOne(() => TagTable, (t) => t.overrides, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tagId" })
    tag: TagTable;

    @Column({ unique: true })
    tagHostId: number;
    @ManyToOne(() => TagHostTable, (th) => th.override, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tagHostId" })
    tagHost: TagHostTable;

    @Column({ type: "integer", nullable: true })
    authorOverrideId: number | null;
    @ManyToOne(() => UserTable, { onDelete: "SET NULL" })
    @JoinColumn({ name: "authorOverrideId" })
    authorOverride: UserTable | null;
}
