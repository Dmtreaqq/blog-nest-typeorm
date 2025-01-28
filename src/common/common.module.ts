import { Global, Module } from '@nestjs/common';
import { CommonConfig } from './common.config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtRefreshStrategy } from './guards/jwt-refresh.strategy';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [JwtStrategy, JwtRefreshStrategy, CommonConfig],
  exports: [CommonConfig, CqrsModule],
})
export class CommonModule {}
