import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Book } from 'src/books/books.model';

@Table
export class Section extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => Book)
  books: Book[];
}
