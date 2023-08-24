import {
  IsInt,
  IsString,
  Length,
  Min,
  IsDate,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

const char255: [number, number] = [1, 255];

export class BookDto {
  @IsString()
  @IsNotEmpty()
  @Length(...char255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(...char255)
  author: string;

  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @Length(...char255)
  summary: string;

  @IsUrl()
  cover: string;

  @IsInt()
  @Min(1)
  copies: number;

  @IsInt()
  @Min(1)
  sectionId: number;
}
