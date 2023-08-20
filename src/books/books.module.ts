import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './books.model';
import { QueryMiddleware } from 'src/_core/middlewares/query.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Book])],
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
