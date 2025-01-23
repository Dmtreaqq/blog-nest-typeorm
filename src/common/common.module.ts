import { Global, Module } from '@nestjs/common';
import { CommonConfig } from './common.config';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [CommonConfig],
  exports: [CommonConfig, CqrsModule],
})
export class CommonModule {}
