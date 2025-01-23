import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserMetaInfo } from './domain/user-meta-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserMetaInfo])],
})
export class UserPlatformModule {}
