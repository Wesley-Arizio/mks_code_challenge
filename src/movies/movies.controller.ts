import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query() { limit, offset }) {
    return this.moviesService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const { affected } = await this.moviesService.update(id, updateMovieDto);

    if (affected == 0) {
      throw new NotFoundException('Resource not found');
    }

    return updateMovieDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { affected } = await this.moviesService.remove(id);

    if (affected == 0) {
      throw new NotFoundException('Resource not found');
    }

    return { deleted: true };
  }
}
