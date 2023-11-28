import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersRepositoryFake } from '../../users/util/test';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

class JwtServiceFake {
  public sign(): void {}
}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useClass: UsersRepositoryFake },
        { provide: JwtService, useClass: JwtServiceFake },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return a valid jwt', async () => {
    const dto = { email: 'test@gmail.com', password: '12345667' } as AuthDto;
    jest.spyOn(service, 'login').mockResolvedValueOnce('token');

    const response = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(response).toStrictEqual({ token: 'token' });
  });
});
