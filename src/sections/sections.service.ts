import { Injectable } from '@nestjs/common';
import { Section } from './sections.model';
import { InjectModel } from '@nestjs/sequelize';
import { IRows } from 'src/_core/interfaces/rows.interface';
import { FindAndCountOptions } from 'sequelize';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private model: typeof Section,
  ) {}

  /**
   * Find sections based on provided options.
   *
   * @param opts - Options for querying sections.
   * @param pagination - If true, applies pagination to the results.
   * @returns A promise containing an array of sections or an object with rows and count.
   */
  async find(
    opts: Omit<FindAndCountOptions<any>, 'group'>,
    pagination = true,
  ): Promise<IRows<Section> | Section[]> {
    return pagination
      ? this.model.findAndCountAll(opts)
      : this.model.findAll(opts);
  }

  /**
   * Find a single section by its ID.
   *
   * @param id - The ID of the section to find.
   * @returns A promise containing the found section.
   */
  findOne(id: string): Promise<Section> {
    return this.model.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Remove a section by its ID.
   *
   * @param id - The ID of the section to remove.
   * @returns A promise that resolves when the section is removed.
   */
  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);
    await model.destroy();
  }
}
