import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './books.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize';
import { IRows } from 'src/_core/interfaces/rows.interface';
import { CreateBookDto, UpdateBookDto } from './books.dto';
import { Section } from 'src/sections/sections.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private model: typeof Book,
    private section: typeof Section,
  ) {}

  /**
   * Find books based on provided options.
   *
   * @param opts - Options for querying books.
   * @param pagination - If true, applies pagination to the results.
   * @returns A promise containing an array of nooks or an object with rows and count.
   */
  async find(
    opts: Omit<FindAndCountOptions<any>, 'group'>,
    pagination = true,
  ): Promise<IRows<Book> | Book[]> {
    return pagination
      ? this.model.findAndCountAll(opts)
      : this.model.findAll(opts);
  }

  /**
   * Find a single book by its ID.
   *
   * @param id - The ID of the book to find.
   * @returns A promise containing the found book.
   */
  async findOne(id: string): Promise<Book> {
    const data = await this.model.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return data;
  }

  /**
   * Create a new book.
   *
   * @param dto - The data for creating a new book.
   * @returns A promise containing the newly created book.
   */
  create(dto: CreateBookDto): Promise<Book> {
    // Check that the section exists
    this._validateSection(dto.sectionId);

    // Create the new book
    return this.model.create({
      title: dto.title,
      author: dto.author,
      date: dto.date,
      cover: dto.cover,
      summary: dto.summary,
      copies: dto.copies,
      sectionId: dto.sectionId,
    });
  }

  /**
   * Update a book by its ID.
   *
   * @param id - The ID of the book to update.
   * @param dto - The data for updating the book.
   * @returns A promise containing the updated book.
   * @throws NotFoundException if the book with the given ID doesn't exist.
   */
  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const model = await this.model.findByPk(id);

    if (!model) {
      // Handle the case when the book with the given ID doesn't exist
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Check that the section exists
    this._validateSection(dto.sectionId);

    // Update the properties of the book with values from the DTO
    model.title = dto.title;
    model.author = dto.author;
    model.date = dto.date;
    model.summary = dto.summary;
    model.cover = dto.cover;
    model.copies = dto.copies;
    model.sectionId = dto.sectionId;

    return model.save();
  }

  /**
   * Remove a book by its ID.
   *
   * @param id - The ID of the book to remove.
   * @returns A promise that resolves when the book is removed.
   * @throws NotFoundException if the book with the given ID doesn't exist.
   */
  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);

    if (!model) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    await this.model.destroy();
  }

  private async _validateSection(id: number) {
    const section = await this.section.findByPk(id);

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
  }
}
