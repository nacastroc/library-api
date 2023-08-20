import { Injectable } from '@nestjs/common';
import { Book } from './books.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.findAll();
  }

  findOne(id: string): Promise<Book> {
    return this.bookModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }
}
