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
import { CreatePostUseCase } from './application/usecases/create-post.usecase';
import { PostsRepository } from './repositories/posts.repository';
import { PostsQueryRepository } from './repositories/query/posts-query.repository';
import { DeletePostUseCase } from './application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase';
import { PostsController } from './api/posts.controller';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post])],
  controllers: [BlogsController, BlogsAdminController, PostsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    BlogsRepository,
    BlogsQueryRepository,
    ...useCases,
  ],
})
export class BlogPlatformModule {}
