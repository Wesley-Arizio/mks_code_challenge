import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepositoryFake } from './util/test';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

  it('should verify if user exist', async () => {
    jest.spyOn(repository, 'exist');

    await service.exist('test@gmail.com');

    expect(repository.exist).toHaveBeenCalledWith({
      where: { email: 'test@gmail.com' },
    });
  });

  it('should create user', async () => {
    const dto = new CreateUserDto('test@gmail.com', 'test');
    const user = {
      email: 'test@gmail.com',
      password: 'test',
    } as User;
    jest.spyOn(repository, 'create').mockReturnValueOnce(user as never);
    jest.spyOn(repository, 'save');

    await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(user);
  });
});
