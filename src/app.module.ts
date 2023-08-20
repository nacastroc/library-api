import { SectionsModule } from './sections/sections.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueryMiddleware } from './_core/middlewares/query.middleware';

@Module({
  imports: [
    // TODO: create production variants
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'library_api_dev',
      autoLoadModels: true,
      synchronize: true,
    }),
    SectionsModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryMiddleware)
      .forRoutes(
        { path: 'sections', method: RequestMethod.GET },
        { path: 'books', method: RequestMethod.GET },
      );
  }
}
