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

const useCases = [CreateUserUseCase, DeleteUserUseCase];

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, UserMetaInfo])],
  providers: [
    CryptoService,
    UsersRepository,
    UsersQueryRepository,
    ...useCases,
  ],
})
export class UserPlatformModule {}
