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
import { Op } from 'sequelize';

describe('SectionsController', () => {
  let app: TestingModule;
  let controller: SectionsController;
  let sectionModel: typeof Section;
  let bookModel: typeof Book;
  let sections: Section[];

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

    controller = app.get<SectionsController>(SectionsController);
    sectionModel = app.get<SectionsService>(SectionsService).modelInstance;
    bookModel = app.get<BooksService>(BooksService).modelInstance;
  });

  beforeEach(async () => {
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

    sections = await sectionModel.bulkCreate(sectionsData);

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
      expect(response['rows']).toBeInstanceOf(Array<Section>);
      expect(response['rows']).toHaveLength(3);
    });

    it('should return a non paginated list of sections if `pagination=false`', async () => {
      const mockRequest = {
        query: { pagination: 'false' },
      };

      const response = await controller.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Array<Section>);
      expect(response).toHaveLength(3);
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
    const opts = { where: { id: { [Op.not]: null } } };
    await bookModel.destroy(opts);
    await sectionModel.destroy(opts);
    sections = [];
  });

  afterAll(async () => {
    app.close();
  });
});
