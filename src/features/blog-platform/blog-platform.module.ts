import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { Post } from './domain/post.entity';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsAdminController } from './api/blogs-admin.controller';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { BlogsQueryRepository } from './repositories/query/blogs-query.repository';
import { BlogsController } from './api/blogs.controller';
import { DeleteBlogUseCase } from './application/usecases/delete-blog.usecase';

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post])],
  controllers: [BlogsController, BlogsAdminController],
  providers: [BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogPlatformModule {}
