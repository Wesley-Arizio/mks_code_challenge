import { Injectable, NotFoundException } from '@nestjs/common';
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
    const movie = await this.moviesRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const { affected } = await this.moviesRepository.update(
      { id },
      updateMovieDto,
    );

    if (affected == 0) {
      throw new NotFoundException('Movie not found');
    }

    return updateMovieDto;
  }

  async remove(id: string) {
    const { affected } = await this.moviesRepository.delete({ id });

    if (affected == 0) {
      throw new NotFoundException('Movie not found');
    }

    return { deleted: true };
  }
}
