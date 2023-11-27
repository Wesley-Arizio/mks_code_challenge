import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const response = await this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );

    Reflect.deleteProperty(response, 'password');

    return response;
  }

  async exist(email: string): Promise<boolean> {
    return this.usersRepository.exist({ where: { email } });
  }
}
