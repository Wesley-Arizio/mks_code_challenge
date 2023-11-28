import { ApiProperty } from '@nestjs/swagger';

export class ListMovies {
  @ApiProperty({
    required: false,
    type: 'number',
    description: 'index of where to start the query for movies',
  })
  offset: number;

  @ApiProperty({
    required: false,
    type: 'number',
    description: 'limit of how much items a result must have',
  })
  limit: number;
}
