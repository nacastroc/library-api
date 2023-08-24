import { IsString, Length, IsNotEmpty } from 'class-validator';

const char255: [number, number] = [1, 255];

export class SectionDto {
  @IsString()
  @IsNotEmpty()
  @Length(...char255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(...char255)
  description: string;
}
