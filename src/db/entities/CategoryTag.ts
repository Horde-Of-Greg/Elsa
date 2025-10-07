// src/db/entities/CategoryTag.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Category } from './Category';
import { Tag } from './Tag';

@Entity({ name: 'category_tags' })
@Index(['categoryId', 'tagId'], { unique: true })
export class CategoryTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryId: number;
    @ManyToOne(() => Category, (c) => c.links, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column()
    tagId: number;
    @ManyToOne(() => Tag, (t) => t.categoryLinks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}
