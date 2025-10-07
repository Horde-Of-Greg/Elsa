import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CategoryTag } from './CategoryTag';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CategoryTag, (ct) => ct.category)
    links: CategoryTag[];
}
