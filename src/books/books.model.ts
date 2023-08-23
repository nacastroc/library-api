import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Section } from './../sections/sections.model';

@Table
export class Book extends Model {
  @Column
  title: string;

  @Column
  author: string;

  @Column
  date: Date;

  @Column
  summary: string;

  @Column
  cover: string;

  @Column
  copies: number;

  @ForeignKey(() => Section)
  @Column({ field: 'sectionId' })
  sectionId: number;

  @BelongsTo(() => Section)
  section: Section;
}
