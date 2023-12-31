import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    required: true,
    description: 'title of the movie',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
    description: 'sinopse of the movie (may contain spoilers)',
  })
  @IsNotEmpty()
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}
