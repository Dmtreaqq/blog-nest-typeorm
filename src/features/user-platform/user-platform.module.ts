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
import { RecoverUserPasswordUseCase } from './application/usecases/recover-password.usecase';
import { ConfirmPasswordUseCase } from './application/usecases/confirm-password.usecase';
import { UserDeviceSession } from './domain/user-device-session.entity';
import { StartSessionUseCase } from './application/usecases/start-session.usecase';
import { UserDeviceSessionsRepository } from './repositories/user-device-sessions.repository';
import { UserDeviceSessionQueryRepository } from './repositories/query/user-device-session-query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { DeleteSessionUseCase } from './application/usecases/delete-session.usecase';
import { DeleteSessionExceptUseCase } from './application/usecases/delete-session-except.usecase';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase';
import { UpdateSessionUseCase } from './application/usecases/update-session.usecase';
import { LogoutUserUseCase } from './application/usecases/logout-user.usecase';

const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ConfirmUserUseCase,
  RecoverUserPasswordUseCase,
  ConfirmPasswordUseCase,
  StartSessionUseCase,
  DeleteSessionUseCase,
  DeleteSessionExceptUseCase,
  RefreshTokenUseCase,
  UpdateSessionUseCase,
  LogoutUserUseCase,
];

@Module({
  controllers: [UsersController, AuthController, SecurityDevicesController],
  imports: [
    CommunicationModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, UserMetaInfo, UserDeviceSession]),
  ],
  providers: [
    LocalStrategy,
    CryptoService,
    UsersRepository,
    UsersQueryRepository,
    UserDeviceSessionsRepository,
    UserDeviceSessionQueryRepository,
    AuthService,
    UserPlatformConfig,
    ...useCases,
  ],
  exports: [UserPlatformConfig],
})
export class UserPlatformModule {}
