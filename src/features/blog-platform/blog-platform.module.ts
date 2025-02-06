import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsAdminController } from './api/blogs-admin.controller';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { BlogsQueryRepository } from './repositories/query/blogs-query.repository';

const useCases = [CreateBlogUseCase, UpdateBlogUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsAdminController],
  providers: [BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogPlatformModule {}
