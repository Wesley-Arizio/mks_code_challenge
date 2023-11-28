import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'unique user email',
    maxLength: 60,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'user unique id',
    type: 'string',
    required: true,
  })
  id: string;

  constructor(email: string, id: string) {
    this.email = email;
    this.id = id;
  }
}
