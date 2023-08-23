import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './books.model';
import { QueryMiddleware } from './../_core/middlewares/query.middleware';
import { Section } from './../sections/sections.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),
    SequelizeModule.forFeature([Section]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryMiddleware)
      .forRoutes({ path: 'books', method: RequestMethod.GET });
  }
}
