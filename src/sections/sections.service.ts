import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Section } from './sections.model';
import { InjectModel } from '@nestjs/sequelize';
import { IRows } from 'src/_core/interfaces/rows.interface';
import { FindAndCountOptions } from 'sequelize';
import { CreateSectionDto, UpdateSectionDto } from './sections.dto';
import { Book } from 'src/books/books.model';

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
  async findOne(id: string): Promise<Section> {
    const data = await this.model.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return data;
  }

  /**
   * Create a new section.
   *
   * @param createSectionDto - The data for creating a new section.
   * @returns A promise containing the newly created section.
   */
  create(createSectionDto: CreateSectionDto): Promise<Section> {
    return this.model.create({
      name: createSectionDto.name,
      description: createSectionDto.description,
    });
  }

  /**
   * Update a section by its ID.
   *
   * @param id - The ID of the section to update.
   * @param updateSectionDto - The data for updating the section.
   * @returns A promise containing the updated section.
   * @throws NotFoundException if the section with the given ID doesn't exist.
   */
  async update(
    id: number,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const model = await this.model.findByPk(id);

    if (!model) {
      // Handle the case when the section with the given ID doesn't exist
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    // Update the properties of the section with values from the DTO
    model.name = updateSectionDto.name;
    model.description = updateSectionDto.description;

    return model.save();
  }

  /**
   * Remove a section by its ID.
   *
   * @param id - The ID of the section to remove.
   * @returns A promise that resolves when the section is removed.
   * @throws NotFoundException if the section with the given ID doesn't exist.
   * @throws ConflictException if the section has existing books.
   */
  async remove(id: string): Promise<void> {
    const data = await this.find(
      {
        where: { id },
        include: [{ model: Book, limit: 1 }],
        limit: 1,
      },
      false,
    );
    const model = data[0];

    if (!model) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    // Check if the section has existing books
    const hasBooks = model.books?.length;
    if (!!hasBooks) {
      throw new ConflictException(
        `Cannot delete section with ID ${id} as it has existing books`,
      );
    }

    await this.model.destroy();
  }
}
