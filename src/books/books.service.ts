import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './books.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Op } from 'sequelize';
import { IRows } from './../_core/interfaces/rows.interface';
import { BookDto } from './books.dto';
import { Section } from './../sections/sections.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private model: typeof Book,
    @InjectModel(Section)
    private sectionModel: typeof Section,
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
  async findOne(id: number): Promise<Book> {
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
  async create(dto: BookDto): Promise<Book> {
    // Check that the section exists
    await this._validateSection(dto.sectionId);

    // Check duplicate
    await this._checkDuplicate(dto);

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
  async update(id: number, dto: BookDto): Promise<Book> {
    const model = await this.model.findByPk(id);

    if (!model) {
      // Handle the case when the book with the given ID doesn't exist
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Check that the section exists
    await this._validateSection(dto.sectionId);

    // Check duplicate
    await this._checkDuplicate(dto, id);

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
  async remove(id: number): Promise<void> {
    const model = await this.findOne(id);

    if (!model) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    await this.model.destroy({ where: { id } });
  }

  /**
   * Validates if a section with the provided ID exists.
   * Throws a NotFoundException if the section is not found.
   *
   * @param id - The ID of the section to validate.
   * @throws NotFoundException if the section with the provided ID is not found.
   */
  private async _validateSection(id: number): Promise<void> {
    /**
     * Find the section using the provided ID.
     * If not found, throw a NotFoundException.
     */
    const section = await this.sectionModel.findByPk(id);

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
  }

  /**
   * Checks if a book with the same title and author already exists.
   * Throws a ConflictException if a duplicate book is found.
   *
   * @param dto - The BookDto containing the book's data.
   * @param id - The ID of the book to exclude from the duplicate check (optional).
   * @throws ConflictException if a book with the same title and author already exists.
   */
  private async _checkDuplicate(dto: BookDto, id = 0): Promise<void> {
    /**
     * Define the search criteria.
     * Check for books with the same title and author, excluding the book with the given ID.
     */
    const where = {
      title: dto.title,
      author: dto.author,
    };

    if (id) {
      where['id'] = { [Op.ne]: id };
    }

    // Find a book matching the search criteria
    const duplicate = await this.model.findOne({ where });

    // If a duplicate book is found, throw a ConflictException
    if (duplicate) {
      throw new ConflictException(
        `Book with title ${dto.title} and author ${dto.author} already exists`,
      );
    }
  }
}
