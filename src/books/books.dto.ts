import { IsInt, IsString, Length, Min, IsDate, IsUrl } from 'class-validator';

const char255: [number, number] = [1, 255];
const char1000: [number, number] = [1, 1000];

export class BookDto {
  @IsString()
  @Length(...char255)
  title: string;

  @IsString()
  @Length(...char255)
  author: string;

  @IsDate()
  date: Date;

  @IsString()
  @Length(...char1000)
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
