import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Section } from './sections.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueryMiddleware } from './../_core/middlewares/query.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Section])],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryMiddleware)
      .forRoutes({ path: 'sections', method: RequestMethod.GET });
  }
}
