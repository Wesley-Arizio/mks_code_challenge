import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @MaxLength(60)
  email: string;

  @MinLength(6)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
