import { SectionsModule } from './sections/sections.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { SequelizeModule } from '@nestjs/sequelize';

const sequelizeConfig = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'library_api_development',
    username: 'postgres',
    password: 'postgres',
  },
  test: {
    host: 'localhost',
    port: 5432,
    database: 'library_api_test',
    username: 'postgres',
    password: 'postgres',
  },
  production: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      ...sequelizeConfig[process.env.NODE_ENV || 'development'],
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production', // Disable automatic schema synchronization in production
    }),
    SectionsModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
