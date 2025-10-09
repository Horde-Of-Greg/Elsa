import { Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { CategoryTagTable } from './CategoryTag';

@Entity({ name: 'categories' })
export class CategoryTable {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CategoryTagTable, (ct) => ct.category)
    links: CategoryTagTable[];
}
