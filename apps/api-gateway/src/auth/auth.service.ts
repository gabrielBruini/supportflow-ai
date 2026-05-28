import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@shared/contracts/auth/login.dto';
import { LoginResponse } from '@shared/contracts/auth/login-response.dto';
import { LogoutDto } from '@shared/contracts/auth/logout.dto';
import { RefreshTokenDto } from '@shared/contracts/auth/refresh-token.dto';
import { RefreshTokenResponse } from '@shared/contracts/auth/refresh-token-response.dto';
import { RegisterUserDto } from '@shared/contracts/auth/register-user.dto';
import { UserResponse } from '@shared/contracts/auth/user-response.dto';
import { firstValueFrom } from 'rxjs';
import { AUTH_PATTERNS } from '@shared/constants';

@Injectable()
export class AuthService {
  constructor(@Inject(AuthService.name) private readonly client: ClientProxy) {}

  async registerUser(dto: RegisterUserDto): Promise<UserResponse> {
    return firstValueFrom(
      this.client.send<UserResponse>(AUTH_PATTERNS.REGISTER, dto),
    );
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    return firstValueFrom(
      this.client.send<LoginResponse>(AUTH_PATTERNS.LOGIN, dto),
    );
  }

  async logout(dto: LogoutDto): Promise<{ message: string }> {
    return firstValueFrom(
      this.client.send<{ message: string }>(AUTH_PATTERNS.LOGOUT, dto),
    );
  }

  async refresh(dto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return firstValueFrom(
      this.client.send<RefreshTokenResponse>(AUTH_PATTERNS.REFRESH, dto),
    );
  }
}
