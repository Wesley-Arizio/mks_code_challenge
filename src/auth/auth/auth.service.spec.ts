import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersRepositoryFake } from '../../users/util/test';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';

class JwtServiceFake {
  public sign(): void {}
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useClass: UsersRepositoryFake },
        { provide: JwtService, useClass: JwtServiceFake },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a valid token if user credentials are correct', async () => {
    const dto = new AuthDto('test@gmail.com', 'test');
    const user = {
      id: 'uuid',
      email: 'test@gmail.com',
      password: '$2b$10$G59UwZ814yF2QLsT8Q0vRehG7MUregz9kNB2Xd0r48HuGO.tZkJS2',
    } as User as never;
    jest
      .spyOn(usersService, 'findUserWithPassword')
      .mockResolvedValueOnce(user);
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('token');

    const response = await service.login(dto);

    expect(usersService.findUserWithPassword).toHaveBeenCalledWith(dto.email);
    expect(jwtService.sign).toHaveBeenCalledWith({
      usr_id: 'uuid',
      usr_email: dto.email,
    });
    expect(response).toBe('token');
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const dto = new AuthDto('test@gmail.com', 'test56');
    jest
      .spyOn(usersService, 'findUserWithPassword')
      .mockResolvedValueOnce(null);
    jest.spyOn(jwtService, 'sign');

    expect.assertions(5);

    try {
      await service.login(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).getStatus()).toBe(
        HttpStatus.BAD_REQUEST,
      );
      expect((e as BadRequestException).message).toBe('Invalid Credentials');
    }

    expect(usersService.findUserWithPassword).toHaveBeenCalledWith(
      'test@gmail.com',
    );
    expect(jwtService.sign).toHaveBeenCalledTimes(0);
  });

  it('should throw BadRequestException if user password is not correct', async () => {
    const dto = new AuthDto('test@gmail.com', 'test566');
    const user = {
      email: 'test@gmail.com',
      password: '$2b$10$G59UwZ814yF2QLsT8Q0vRehG7MUregz9kNB2Xd0r48HuGO.tZkJS2',
    } as User as never;
    jest
      .spyOn(usersService, 'findUserWithPassword')
      .mockResolvedValueOnce(user);
    jest.spyOn(jwtService, 'sign');

    expect.assertions(5);

    try {
      await service.login(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).getStatus()).toBe(
        HttpStatus.BAD_REQUEST,
      );
      expect((e as BadRequestException).message).toBe('Invalid Credentials');
    }

    expect(usersService.findUserWithPassword).toHaveBeenCalledWith(
      'test@gmail.com',
    );
    expect(jwtService.sign).toHaveBeenCalledTimes(0);
  });
});
