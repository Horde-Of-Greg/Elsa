import { Entity, PrimaryGeneratedColumn, OneToMany, Column, Index } from 'typeorm';
import { CategoryTagTable } from './CategoryTag';

@Entity({ name: 'categories' })
export class CategoryTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({
        type: 'varchar',
        length: 32,
    })
    name: string;

    @OneToMany(() => CategoryTagTable, (ct) => ct.category)
    links: CategoryTagTable[];
}
