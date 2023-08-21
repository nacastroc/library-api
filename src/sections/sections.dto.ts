import { IsString, Length } from 'class-validator';

const char255: [number, number] = [1, 255];

export class SectionDto {
  @IsString()
  @Length(...char255)
  name: string;

  @IsString()
  @Length(...char255)
  description: string;
}
