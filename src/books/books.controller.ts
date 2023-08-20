import { Controller, Get } from '@nestjs/common';
import { Book } from './books.model';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  @Get('all')
  find(): Promise<Book[]> {
    return this.service.findAll();
  }
}
