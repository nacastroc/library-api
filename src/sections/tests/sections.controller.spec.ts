import { Test, TestingModule } from '@nestjs/testing';
import { SectionsController } from '../sections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { config as sequelizeConfig } from '../../_database/ts-config/config';
import { SectionsModule } from '../sections.module';
import { BooksModule } from '../../books/books.module';
import { Section } from '../sections.model';

describe('SectionsController', () => {
  let sectionsController: SectionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    sectionsController = app.get<SectionsController>(SectionsController);
  });

  describe('/sections (GET)', () => {
    it('should return a paginated list of sections', async () => {
      const mockRequest = {
        query: {},
      };
      const response = await sectionsController.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('count');
      expect(response).toHaveProperty('rows');
      response['rows'].forEach((section: Section) => {
        expect(section).toHaveProperty('id');
        expect(typeof section.id).toBe('number');
        expect(section).toHaveProperty('name');
        expect(typeof section.name).toBe('string');
        expect(section).toHaveProperty('description');
        expect(typeof section.description).toBe('string');
        expect(section).toHaveProperty('createdAt');
        expect(typeof section.createdAt).toBe('string');
        expect(section).toHaveProperty('updatedAt');
        expect(typeof section.description).toBe('string');
      });
    });
  });

  describe('/sections?pagination=false (GET)', () => {
    it('should return all sections', async () => {
      const mockRequest = {
        query: { pagination: 'false' },
      };
      const response = await sectionsController.find(mockRequest);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('length');
      expect(response).not.toHaveProperty('rows');
      expect(response).not.toHaveProperty('count');
    });
  });
});
