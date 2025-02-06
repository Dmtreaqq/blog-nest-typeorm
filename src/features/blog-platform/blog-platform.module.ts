import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [],
  providers: [],
})
export class BlogPlatformModule {}
