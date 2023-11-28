import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesRepositoryFake } from './util/test';
import { CreateMovieDto } from './dto/create-movie.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useClass: MoviesRepositoryFake },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create a new movie', async () => {
    const dto = new CreateMovieDto('iron man', 'lorem ipsum');
    const movie = {
      title: 'iron man',
      description: 'lorem ipsum',
      id: 'id',
    } as Movie;
    jest.spyOn(service, 'create').mockResolvedValueOnce(movie as never);
    const response = await controller.create(dto);
    expect(response).toStrictEqual(movie);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should be able to list movies using offset and limit', async () => {
    const movies = [
      { title: 'iron man 1', description: 'lorem ipsum...' } as Movie as never,
      { title: 'iron man 2', description: 'lorem ipsum...' } as Movie as never,
      { title: 'iron man 3', description: 'lorem ipsum...' } as Movie as never,
    ];
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(movies);
    const response = await controller.findAll({ limit: 10, offset: 0 });

    expect(service.findAll).toHaveBeenCalledWith(0, 10);
    expect(response).toStrictEqual(movies);
  });

  it('should be able to find movie by id', async () => {
    const movie = {
      title: 'iron man 1',
      description: 'lorem ipsum...',
    } as Movie as never;
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(movie);
    const response = await controller.findOne('id');

    expect(response).toStrictEqual(movie);
    expect(service.findOne).toHaveBeenCalledWith('id');
  });

  it('should throw NotFoundException if movie is not found', async () => {
    jest.spyOn(service, 'findOne').mockImplementationOnce(async () => {
      throw new NotFoundException('Movie not found');
    });
    expect.assertions(4);
    try {
      await controller.findOne('id');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect((e as NotFoundException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((e as NotFoundException).message).toBe('Movie not found');
    }
    expect(service.findOne).toHaveBeenCalledWith('id');
  });

  it('should be able to update a movie by id', async () => {
    const updateDTO = {
      title: 'iron man',
      description: 'lorem ipsum...',
    } as UpdateMovieDto;
    jest.spyOn(service, 'update').mockResolvedValueOnce(updateDTO);
    const response = await controller.update('id', updateDTO);
    expect(response).toStrictEqual(updateDTO);
    expect(service.update).toHaveBeenCalledWith('id', updateDTO);
  });

  it('should throw NotFoundException if movie is not found when updating it', async () => {
    const updateDTO = {
      title: 'iron man',
      description: 'lorem ipsum...',
    } as UpdateMovieDto;
    jest.spyOn(service, 'update').mockImplementationOnce(async () => {
      throw new NotFoundException('Resource not found');
    });

    expect.assertions(4);

    try {
      await controller.update('id', updateDTO);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect((e as NotFoundException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((e as NotFoundException).message).toBe('Resource not found');
    }
    expect(service.update).toHaveBeenCalledWith('id', updateDTO);
  });

  it('should be able to delete a movie by id', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({ deleted: true });
    const response = await controller.remove('id');
    expect(response).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('id');
  });

  it('should throw NotFoundException if movie is not found when deleting it', async () => {
    jest.spyOn(service, 'remove').mockImplementationOnce(async () => {
      throw new NotFoundException('Resource not found');
    });

    expect.assertions(4);
    try {
      await controller.remove('id');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect((e as NotFoundException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((e as NotFoundException).message).toBe('Resource not found');
    }
    expect(service.remove).toHaveBeenCalledWith('id');
  });
});
