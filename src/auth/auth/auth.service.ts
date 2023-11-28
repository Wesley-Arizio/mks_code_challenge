import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PasswordHandler } from '../../users/util/password-handler';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  usr_id: string;
  usr_email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.usersService.findUserWithPassword(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isCorrectPassword = PasswordHandler.compare(
      dto.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload: JwtPayload = {
      usr_id: user.id,
      usr_email: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
