import { Test, TestingModule } from '@nestjs/testing';
import { SectionsController } from './sections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { config as sequelizeConfig } from '../_database/ts-config/config';
import { SectionsModule } from './sections.module';
import { BooksModule } from '../books/books.module';
import { Section } from './sections.model';
import { SectionsService } from './sections.service';
import { Book } from '../books/books.model';
import { BooksService } from '../books/books.service';

describe('SectionsController', () => {
  let app: TestingModule;
  let controller: SectionsController;
  let sectionModel: typeof Section;
  let bookModel: typeof Book;
  let sections: Section[];

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          ...sequelizeConfig[process.env.NODE_ENV || 'test'],
          autoLoadModels: true,
          synchronize: process.env.NODE_ENV !== 'production', // Disable automatic schema synchronization in production
        }),
        SectionsModule,
        BooksModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<SectionsController>(SectionsController);
    sectionModel = app.get<SectionsService>(SectionsService).modelInstance;
    bookModel = app.get<BooksService>(BooksService).modelInstance;

    sections = [];

    const sectionsData = [
      {
        name: 'Section 1',
        description: 'Description 1',
      },
      {
        name: 'Section 2',
        description: 'Description 2',
      },
      {
        name: 'Section 3',
        description: 'Description 3',
      },
    ];

    for (const section of sectionsData) {
      sections.push(await sectionModel.create(section));
    }

    await bookModel.create({
      title: 'Title 1',
      author: 'Author 1',
      summary: 'Summary 1',
      cover: 'https://images.dummy.com/image.jpg',
      copies: 1,
      sectionId: sections[2].id,
      date: new Date(),
    });
  });

  describe('GET /sections', () => {
    it('should return a paginated list of sections', async () => {
      const mockRequest = {
        query: {},
      };
      const response = await controller.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('count');
      expect(response['count']).toBe(3);
      expect(response).toHaveProperty('rows');
      expect(response['rows']).toHaveProperty('length');
      expect(response['rows'].length).toBe(3);
      response['rows'].forEach((section: Section) => {
        expect(section).toHaveProperty('id');
        expect(typeof section.id).toBe('number');
        expect(section).toHaveProperty('name');
        expect(typeof section.name).toBe('string');
        expect(section).toHaveProperty('description');
        expect(typeof section.description).toBe('string');
        expect(section).toHaveProperty('createdAt');
        expect(section.createdAt instanceof Date).toBe(true);
        expect(section).toHaveProperty('updatedAt');
        expect(section.updatedAt instanceof Date).toBe(true);
      });
    });

    it('should return a non paginated list of sections if `pagination=false`', async () => {
      const mockRequest = {
        query: { pagination: 'false' },
      };
      const response = await controller.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('length');
      expect(response['length']).toBe(3);
      expect(response).not.toHaveProperty('rows');
      expect(response).not.toHaveProperty('count');
    });
  });

  describe('POST /sections', () => {
    it('should allow to create sections with valid data', async () => {
      const section = {
        name: 'Section 4',
        description: 'Description 4',
      };

      const response = await controller.create(section);
      expect(response).toBeInstanceOf(Section);
    });

    it('should return error when adding a section with the same name as an existing one', async () => {
      const section = {
        name: 'Section 1',
        description: 'Description 1',
      };

      try {
        await controller.create(section);
      } catch (error) {
        expect(error.message).toBe(
          'Section with name Section 1 already exists',
        );
      }
    });
  });

  describe('PUT /sections/:id', () => {
    it('should allow to update sections with valid data by given id', async () => {
      const section = {
        name: 'Section 1 edited',
        description: 'Description 1 edited',
      };

      const response = await controller.update(sections[0].id, section);
      expect(response).toBeInstanceOf(Section);
    });

    it('should return error when updating a non existing section', async () => {
      const section = {
        name: 'Section edited',
        description: 'Description edited',
      };

      const id = sections[2].id + 1;

      try {
        await controller.update(id, section);
      } catch (error) {
        expect(error.message).toBe(`Section with ID ${id} not found`);
      }
    });

    it('should return error when updating a section with the same name as an existing one', async () => {
      const section = {
        name: 'Section 1',
        description: 'Description edited',
      };

      const id = sections[1].id;

      try {
        await controller.update(id, section);
      } catch (error) {
        expect(error.message).toBe(
          'Section with name Section 1 already exists',
        );
      }
    });
  });

  describe('DELETE /sections:id', () => {
    it('should allow to remove a section via its ID', async () => {
      const response = await controller.remove(sections[0].id);
      expect(response).toBeUndefined();
    });

    it('should return error when removing a non existing section', async () => {
      try {
        await controller.remove(sections[2].id + 1);
      } catch (error) {
        expect(error.message).toBe(
          `Section with ID ${sections[2].id + 1} not found`,
        );
      }
    });

    it('should return error when removing a section with existing books', async () => {
      try {
        await controller.remove(sections[2].id);
      } catch (error) {
        expect(error.message).toBe(
          `Cannot delete section with ID ${sections[2].id} as it has existing books`,
        );
      }
    });
  });

  afterEach(async () => {
    const bookRecords = await bookModel.findAll();

    for (const book of bookRecords) {
      await book.destroy();
    }

    const sectionRecords = await sectionModel.findAll();

    for (const section of sectionRecords) {
      await section.destroy();
    }

    sections = [];

    app.close();
  });
});
