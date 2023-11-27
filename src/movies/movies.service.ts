import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  create(createMovieDto: CreateMovieDto) {
    return this.moviesRepository.save(
      this.moviesRepository.create(createMovieDto),
    );
  }

  findAll(offset: number, limit: number) {
    return this.moviesRepository.find({
      skip: offset,
      take: limit,
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    return this.moviesRepository.findOneBy({ id });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.moviesRepository.update({ id }, updateMovieDto);
  }

  remove(id: string) {
    return this.moviesRepository.delete({ id });
  }
}
