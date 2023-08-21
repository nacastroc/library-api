import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { Section } from './sections.model';
import { IRows } from 'src/_core/interfaces/rows.interface';
import { SectionDto } from './sections.dto';

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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Section> {
    return this.service.findOne(id);
  }

  /**
   * Create a new section.
   *
   * @param dto - The data for creating a new section.
   * @returns A promise containing the newly created section.
   */
  @Post()
  create(@Body(new ValidationPipe()) dto: SectionDto): Promise<Section> {
    return this.service.create(dto);
  }

  /**
   * Update a section by its ID.
   *
   * @param id - ID of the section to update.
   * @param dto - The data for updating the section.
   * @returns A promise containing the updated section.
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    dto: SectionDto,
  ): Promise<Section> {
    return this.service.update(id, dto);
  }

  /**
   * Remove a specific section object by its ID
   * @param id - ID of the section
   * @returns void
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
