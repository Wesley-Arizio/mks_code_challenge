import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'jwt access token',
  })
  token: string;
}
