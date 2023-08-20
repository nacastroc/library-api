import { IsInt, IsString, Length, Min } from 'class-validator';

const char255: [number, number] = [1, 255];

export class CreateSectionDto {
  @IsString()
  @Length(...char255)
  name: string;

  @IsString()
  @Length(...char255)
  description: string;
}

export class UpdateSectionDto extends CreateSectionDto {
  @IsInt()
  @Min(1)
  id: number;
}
