import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersRepositoryFake } from './util/test';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: UsersRepositoryFake },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    controller = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a new user', async () => {
    jest
      .spyOn(service, 'create')
      .mockImplementationOnce(({ email, password }) => {
        return {
          id: 'any id',
          email,
          password,
        } as User as never;
      });

    const result = await controller.create(
      new CreateUserDto('test@email.com', 'test'),
    );

    expect(service.create).toHaveBeenCalledWith(
      new CreateUserDto('test@email.com', expect.any(String)),
    );
    expect(result).toStrictEqual({
      id: 'any id',
      email: 'test@email.com',
      password: expect.any(String),
    } as User);
  });

  it('should throw error if user already exists', async () => {
    // Simulating that the service threw this error, the service already has unit test
    jest.spyOn(service, 'create').mockImplementationOnce(async () => {
      throw new BadRequestException('Invalid credentials');
    });

    expect.assertions(4);

    try {
      await controller.create(new CreateUserDto('test@email.com', 'test'));
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect((e as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((e as HttpException).message).toBe('Invalid credentials');
    }

    expect(service.create).toHaveBeenCalledTimes(1);
  });
});
