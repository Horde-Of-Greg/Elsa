import { Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { CategoryTag } from './CategoryTag';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CategoryTag, (ct) => ct.category)
    links: CategoryTag[];
}
