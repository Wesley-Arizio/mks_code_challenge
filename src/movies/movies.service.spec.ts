import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesRepositoryFake } from './util/test';
import { CreateMovieDto } from './dto/create-movie.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useClass: MoviesRepositoryFake },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a new movie', async () => {
    const dto = new CreateMovieDto('Interstelar', 'space and time travel');
    const movie = {
      title: 'Interstelar',
      description: 'space and time travel',
    } as Movie;
    jest.spyOn(repository, 'create').mockReturnValueOnce(movie as never);
    jest.spyOn(repository, 'save').mockReturnValueOnce(movie as never);

    const response = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(movie);
    expect(response.title).toBe('Interstelar');
    expect(response.description).toBe('space and time travel');
  });

  it('should be able to get a movie by id', async () => {
    const movie = {
      title: 'iron man',
      description: 'lorem ipsum...',
    } as Movie;
    jest.spyOn(repository, 'findOneBy').mockReturnValueOnce(movie as never);

    const response = await service.findOne('id');
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'id' });
    expect(response).toStrictEqual(movie);
  });

  it('should be able to list movies with pagination', async () => {
    const movies = [
      { title: 'Joker', description: 'lorem ipsum...' } as Movie as never,
      { title: 'Batman', description: 'lorem ipsum...' } as Movie as never,
    ];
    jest.spyOn(repository, 'find').mockResolvedValueOnce(movies);

    const response = await service.findAll(0, 10);
    expect(repository.find).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { id: 'ASC' },
    });
    expect(response.length).toBe(2);
  });

  it('should be able to update a movie by id', async () => {
    jest
      .spyOn(repository, 'update')
      .mockReturnValueOnce({ affected: 1 } as UpdateResult as never);
    const updateDTO = new UpdateMovieDto('iron man', 'lorem ipsum...');
    const response = await service.update('id', updateDTO);
    expect(repository.update).toHaveBeenCalledWith({ id: 'id' }, updateDTO);
    expect(response.affected).toStrictEqual(1);
  });

  it('should be able to delete a movie by id', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValueOnce({ affected: 1 } as DeleteResult);
    const response = await service.remove('id');
    expect(repository.delete).toHaveBeenCalledWith({ id: 'id' });
    expect(response.affected).toBe(1);
  });
});
