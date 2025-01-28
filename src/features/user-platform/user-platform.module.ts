import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserMetaInfo } from './domain/user-meta-info.entity';
import { UsersController } from './api/users.controller';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { UsersRepository } from './repositories/users.repository';
import { CryptoService } from './application/crypto.service';
import { UsersQueryRepository } from './repositories/query/user-query.repository';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserPlatformConfig } from './config/user-platform.config';
import { LocalStrategy } from './api/guards/local.strategy';
import { CommunicationModule } from '../communication/communication.module';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { ConfirmUserUseCase } from './application/usecases/confirm-user.usecase';

const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ConfirmUserUseCase,
];

@Module({
  controllers: [UsersController, AuthController],
  imports: [
    CommunicationModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, UserMetaInfo]),
  ],
  providers: [
    LocalStrategy,
    CryptoService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    UserPlatformConfig,
    ...useCases,
  ],
  exports: [UserPlatformConfig],
})
export class UserPlatformModule {}
