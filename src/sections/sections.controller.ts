import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { Section } from './sections.model';
import { IRows } from 'src/_core/interfaces/rows.interface';

@Controller('sections')
export class SectionsController {
  constructor(private readonly service: SectionsService) {}

  /**
   * List sections (pagination of results by default).
   * @param req - HTTP request
   * @returns a list of section objects
   */
  @Get()
  find(@Req() req): Promise<IRows<Section> | Section[]> {
    const pagination = req.query.pagination === 'false' ? false : true;
    return this.service.find(req.queryOptions, pagination);
  }

  /**
   * Get a specific section object by its ID
   * @param id - ID of the section
   * @returns a single section
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Section> {
    return this.service.findOne(id);
  }

  /**
   * Remove a specific section object by its ID
   * @param id - ID of the section
   * @returns void
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
