import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBody, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: AuthDto })
  @ApiResponse({
    type: AuthResponse,
    status: 200,
    description: 'jwt access token',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Invalid credentials',
  })
  @Post('login')
  async login(@Body() body: AuthDto) {
    const token = await this.authService.login(body);

    return { token };
  }
}
