import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtGuard } from '../auth/jwt.guard';
import {
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListMovies } from './dto/list-movies.dto';
import { MovieDto } from './dto/movie.dto';
import { constants } from '../constants';

@UseGuards(JwtGuard)
@ApiBearerAuth(constants.JWT_AUTH_NAME)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({
    status: 200,
    type: MovieDto,
    description: 'recent created movie',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description:
      'must provide a valid jwt access token to access this endpoint',
  })
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiQuery({ type: ListMovies })
  @ApiResponse({ status: 200, type: [MovieDto], description: 'List of movies' })
  @ApiUnauthorizedResponse({
    status: 401,
    description:
      'must provide a valid jwt access token to access this endpoint',
  })
  @Get()
  findAll(@Query() { limit, offset }) {
    return this.moviesService.findAll(offset, limit);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'id of the movie',
    required: true,
  })
  @ApiResponse({
    type: MovieDto,
    status: 200,
    description: 'The movie with the given id',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'the movie with the given id does not exist',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description:
      'must provide a valid jwt access token to access this endpoint',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'id of the movie',
    required: true,
  })
  @ApiResponse({
    type: MovieDto,
    status: 200,
    description: 'The movie with updated data',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'the movie with the given id does not exist',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description:
      'must provide a valid jwt access token to access this endpoint',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'id of the movie to be deleted',
    required: true,
  })
  @ApiResponse({
    type: 'boolean',
    status: 200,
    description: 'true if the movie was deleted',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'the movie with the given id does not exist',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description:
      'must provide a valid jwt access token to access this endpoint',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return (await this.moviesService.remove(id)).deleted;
  }
}
