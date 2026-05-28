import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '@shared/contracts/auth/login.dto';
import { LoginResponse } from '@shared/contracts/auth/login-response.dto';
import { LogoutDto } from '@shared/contracts/auth/logout.dto';
import { RefreshTokenDto } from '@shared/contracts/auth/refresh-token.dto';
import { RefreshTokenResponse } from '@shared/contracts/auth/refresh-token-response.dto';
import { RegisterUserDto } from '@shared/contracts/auth/register-user.dto';
import { UserResponse } from '@shared/contracts/auth/user-response.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<UserResponse> {
    return await this.authService.registerUser(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutDto): Promise<{ message: string }> {
    return await this.authService.logout(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return await this.authService.refresh(dto);
  }
}
