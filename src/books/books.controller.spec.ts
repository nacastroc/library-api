import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { Book } from './books.model';
import { Section } from './../sections/sections.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionsModule } from './../sections/sections.module';
import { BooksModule } from './books.module';
import { config as sequelizeConfig } from '../_database/ts-config/config';
import { AppController } from './../app.controller';
import { AppService } from './../app.service';
import { BooksService } from './books.service';
import { SectionsService } from '../sections/sections.service';
import { Op } from 'sequelize';

describe('BooksController', () => {
  let app: TestingModule;
  let controller: BooksController;
  let bookModel: typeof Book;
  let books: Book[];
  let sectionModel: typeof Section;
  let section: Section;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          sequelizeConfig[process.env.NODE_ENV || 'test'],
        ),
        SectionsModule,
        BooksModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<BooksController>(BooksController);
    bookModel = app.get<BooksService>(BooksService).modelInstance;
    sectionModel = app.get<SectionsService>(SectionsService).modelInstance;
  });

  beforeEach(async () => {
    section = await sectionModel.create({
      name: 'Section 1',
      description: 'Description 1',
    });

    const booksData = [
      {
        title: 'Title 1',
        author: 'Author 1',
        summary: 'Summary 1',
        cover: 'https://images.dummy.com/image.jpg',
        copies: 1,
        sectionId: section.id,
        date: new Date(),
      },
      {
        title: 'Title 2',
        author: 'Author 2',
        summary: 'Summary 2',
        cover: 'https://images.dummy.com/image2.jpg',
        copies: 2,
        sectionId: section.id,
        date: new Date(),
      },
      {
        title: 'Title 3',
        author: 'Author 3',
        summary: 'Summary 3',
        cover: 'https://images.dummy.com/image3.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      },
    ];

    books = await bookModel.bulkCreate(booksData);
  });

  describe('GET /books', () => {
    it('should return a paginated list of books', async () => {
      const mockRequest = {
        query: {},
      };

      const response = await controller.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('count');
      expect(response['count']).toBe(3);
      expect(response).toHaveProperty('rows');
      expect(response['rows']).toBeInstanceOf(Array<Book>);
      expect(response['rows']).toHaveLength(3);
    });

    it('should return a non paginated list of books if `pagination=false`', async () => {
      const mockRequest = {
        query: { pagination: 'false' },
      };

      const response = await controller.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Array<Section>);
      expect(response).toHaveLength(3);
    });
  });

  describe('POST /books', () => {
    it('should allow to create books with valid data', async () => {
      const book = {
        title: 'Title 4',
        author: 'Author 4',
        summary: 'Summary 4',
        cover: 'https://images.dummy.com/image4.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      };

      const response = await controller.create(book);

      expect(response).toBeInstanceOf(Book);
    });

    it('should return error when adding a book with the same title and author as an existing one', async () => {
      const book = {
        title: 'Title 3',
        author: 'Author 3',
        summary: 'Summary 3',
        cover: 'https://images.dummy.com/image3.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      };

      try {
        await controller.create(book);
      } catch (error) {
        expect(error.message).toBe(
          `Book with title ${book.title} and author ${book.author} already exists`,
        );
      }
    });

    it('should return error when creating a book for a non existing section', async () => {
      const id = section.id + 1;

      const book = {
        title: 'Title 4',
        author: 'Author 4',
        summary: 'Summary 4',
        cover: 'https://images.dummy.com/image4.jpg',
        copies: 3,
        sectionId: id,
        date: new Date(),
      };

      try {
        await controller.create(book);
      } catch (error) {
        expect(error.message).toBe(`Section with ID ${id} not found`);
      }
    });
  });

  describe('PUT /books/:id', () => {
    it('should allow to update books with valid data by given id', async () => {
      const book = {
        title: 'Title edited',
        author: 'Author edited',
        summary: 'Summary edited',
        cover: 'https://images.dummy.com/image4.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      };

      const response = await controller.update(books[0].id, book);

      expect(response).toBeInstanceOf(Book);
    });

    it('should return error when updating a non existing book', async () => {
      const book = {
        title: 'Title edited',
        author: 'Author edited',
        summary: 'Summary edited',
        cover: 'https://images.dummy.com/image4.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      };

      const id = books[2].id + 1;

      try {
        await controller.update(id, book);
      } catch (error) {
        expect(error.message).toBe(`Book with ID ${id} not found`);
      }
    });

    it('should return error when updating a book with the same title and author as an existing one', async () => {
      const book = {
        title: 'Title 1',
        author: 'Author 1',
        summary: 'Summary 3',
        cover: 'https://images.dummy.com/image3.jpg',
        copies: 3,
        sectionId: section.id,
        date: new Date(),
      };

      const id = books[2].id;

      try {
        await controller.update(id, book);
      } catch (error) {
        expect(error.message).toBe(
          `Book with title ${book.title} and author ${book.author} already exists`,
        );
      }
    });

    it('should return error when updating a book for a non existing section', async () => {
      const id = books[2].id;

      const book = {
        title: 'Title 4',
        author: 'Author 4',
        summary: 'Summary 4',
        cover: 'https://images.dummy.com/image4.jpg',
        copies: 3,
        sectionId: section.id + 1,
        date: new Date(),
      };

      try {
        await controller.update(id, book);
      } catch (error) {
        expect(error.message).toBe(
          `Section with ID ${section.id + 1} not found`,
        );
      }
    });
  });

  describe('DELETE /books:id', () => {
    it('should allow to remove a section via its ID', async () => {
      const response = await controller.remove(books[0].id);
      expect(response).toBeUndefined();
    });

    it('should return error when removing a non existing book', async () => {
      try {
        await controller.remove(books[2].id + 1);
      } catch (error) {
        expect(error.message).toBe(`Book with ID ${books[2].id + 1} not found`);
      }
    });
  });

  afterEach(async () => {
    const opts = { where: { id: { [Op.not]: null } } };
    await bookModel.destroy(opts);
    await sectionModel.destroy(opts);
    books = [];
    section = null;
  });

  afterAll(async () => {
    app.close();
  });
});
