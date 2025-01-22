import { Global, Module } from '@nestjs/common';
import { CommonConfig } from './common.config';

@Global()
@Module({
  providers: [CommonConfig],
  exports: [CommonConfig],
})
export class CommonModule {}
