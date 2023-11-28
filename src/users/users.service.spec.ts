import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepositoryFake } from './util/test';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: UsersRepositoryFake },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new user', async () => {
    const dto = new CreateUserDto('test@gmail.com', 'test');
    const user = {
      email: 'test@gmail.com',
      password: 'test',
    } as User;
    jest.spyOn(repository, 'exist').mockResolvedValueOnce(false);
    jest.spyOn(repository, 'create').mockReturnValueOnce(user as never);
    jest.spyOn(repository, 'save').mockReturnValueOnce(user as never);

    const response = await service.create(dto);

    expect(repository.exist).toHaveBeenCalledWith({
      where: { email: 'test@gmail.com' },
    });
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(user);
    expect(response.email).toBe('test@gmail.com');
    expect(response.password).toBeUndefined();
  });

  it('should throw BadRequestException if there is a user with the same email', async () => {
    const dto = new CreateUserDto('test@gmail.com', 'test');
    jest.spyOn(repository, 'exist').mockResolvedValueOnce(true);
    jest.spyOn(repository, 'create');
    jest.spyOn(repository, 'save');

    expect.assertions(6);

    try {
      await service.create(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).getStatus()).toBe(
        HttpStatus.BAD_REQUEST,
      );
      expect((e as BadRequestException).message).toBe('Invalid credentials');
    }
    expect(repository.exist).toHaveBeenCalledWith({
      where: { email: 'test@gmail.com' },
    });
    expect(repository.create).toHaveBeenCalledTimes(0);
    expect(repository.save).toHaveBeenCalledTimes(0);
  });
});
