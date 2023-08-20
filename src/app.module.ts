import { SectionsModule } from './sections/sections.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueryMiddleware } from './_core/middlewares/query.middleware';
import { SectionsController } from './sections/sections.controller';

@Module({
  imports: [
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
    consumer.apply(QueryMiddleware).forRoutes(SectionsController);
  }
}
