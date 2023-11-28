import { IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'unique user email',
    maxLength: 60,
    required: true,
  })
  @IsEmail()
  @MaxLength(60)
  email: string;

  @ApiProperty({
    description: 'user password',
    minLength: 6,
    required: true,
  })
  @MinLength(6)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
