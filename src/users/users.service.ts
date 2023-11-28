import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordHandler } from './util/password-handler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.usersRepository.exist({
      where: { email: createUserDto.email },
    });

    if (exists) {
      throw new BadRequestException('Invalid credentials');
    }

    createUserDto.password = PasswordHandler.hashPassword(
      createUserDto.password,
    );

    const response = await this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );

    Reflect.deleteProperty(response, 'password');

    return response;
  }

  async findUserWithPassword(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      select: { password: true },
    });
  }
}
