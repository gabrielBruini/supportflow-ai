import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@shared/constants/pattern';
import { LoginDto } from '@shared/contracts/auth/login.dto';
import { LoginResponse } from '@shared/contracts/auth/login-response.dto';
import { LogoutDto } from '@shared/contracts/auth/logout.dto';
import { RefreshTokenDto } from '@shared/contracts/auth/refresh-token.dto';
import { RefreshTokenResponse } from '@shared/contracts/auth/refresh-token-response.dto';
import { RegisterUserDto } from '@shared/contracts/auth/register-user.dto';
import { UserResponse } from '@shared/contracts/auth/user-response.dto';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { RegisterUserService } from './services/register-user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerUserService: RegisterUserService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(@Payload() dto: RegisterUserDto): Promise<UserResponse> {
    return this.registerUserService.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Payload() dto: LoginDto): Promise<LoginResponse> {
    return this.loginService.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  async logout(@Payload() dto: LogoutDto): Promise<{ message: string }> {
    return this.logoutService.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH)
  async refresh(
    @Payload() dto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.refreshTokenService.execute(dto);
  }
}
