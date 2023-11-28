import { IsEmail, MinLength, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: 'string',
    description: 'user email',
    required: true,
  })
  @IsEmail()
  @MaxLength(60)
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'user password',
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
