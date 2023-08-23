import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Book } from './books.model';
import { BooksService } from './books.service';
import { IRows } from './../_core/interfaces/rows.interface';
import { BookDto } from './books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  /**
   * List books (pagination of results by default).
   * @param req - HTTP request
   * @returns a list of book objects
   */
  @Get()
  find(@Req() req): Promise<IRows<Book> | Book[]> {
    const pagination = req.query.pagination === 'false' ? false : true;
    return this.service.find(req.queryOptions, pagination);
  }

  /**
   * Get a specific book object by its ID
   * @param id - ID of the book
   * @returns a single book
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.service.findOne(id);
  }

  /**
   * Create a new book.
   *
   * @param dto - The data for creating a new book.
   * @returns A promise containing the newly created book.
   */
  @Post()
  create(@Body(new ValidationPipe()) dto: BookDto): Promise<Book> {
    return this.service.create(dto);
  }

  /**
   * Update a book by its ID.
   *
   * @param id - ID of the book to update.
   * @param dto - The data for updating the book.
   * @returns A promise containing the updated book.
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    dto: BookDto,
  ): Promise<Book> {
    return this.service.update(id, dto);
  }

  /**
   * Remove a specific book object by its ID
   * @param id - ID of the book
   * @returns void
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
