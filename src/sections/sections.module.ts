import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { Module } from '@nestjs/common';
import { Section } from './sections.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Section])],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
