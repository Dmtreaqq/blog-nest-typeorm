import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsAdminController } from './api/blogs-admin.controller';

const useCases = [CreateBlogUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsAdminController],
  providers: [BlogsRepository, ...useCases],
})
export class BlogPlatformModule {}
