import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterUserDto } from '@shared/contracts/auth/register-user.dto';
import bcrypt from 'bcryptjs';
import { UserResponse } from '@shared/contracts/auth/user-response.dto';
import { UserRepository } from '../repository/user.repository';
import { USER_EVENTS } from '@shared/constants';
import { UserCreatedEvent } from '@shared/events/user-created.event';
import { SERVICES } from '@shared/constants/services';

@Injectable()
export class RegisterUserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(SERVICES.AUTH_EVENTS_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  async execute(dto: RegisterUserDto): Promise<UserResponse> {
    const existing = await this.userRepository.existsByEmail(dto.email);

    if (existing) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    this.eventsClient.emit(
      USER_EVENTS.CREATED,
      new UserCreatedEvent(user.id, user.name, user.email),
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
