import { SectionsModule } from './sections/sections.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { config as sequelizeConfig } from './_database/ts-config/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
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
