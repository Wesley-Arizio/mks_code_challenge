import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordHandler } from './util/password-handler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // TODO - validate email
    const exists = await this.usersService.exist(createUserDto.email);

    if (exists) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    createUserDto.password = PasswordHandler.hashPassword(
      createUserDto.password,
    );

    return this.usersService.create(createUserDto);
  }
}
