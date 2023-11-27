import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  constructor(title?: string, description?: string) {
    super();
    this.title = title;
    this.description = description;
  }
}
