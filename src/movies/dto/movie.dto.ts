import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    required: true,
    description: 'unique identifier of the movie',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'title of the movie',
  })
  title: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'sinopse of the movie (may contain spoilers)',
  })
  description: string;

  constructor(id: string, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}
