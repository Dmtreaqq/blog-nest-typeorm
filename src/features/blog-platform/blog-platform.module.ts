import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { Post } from './domain/post.entity';
import { Comment } from './domain/comment.entity';
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
import { CommentsRepository } from './repositories/comments.repository';
import { CommentsQueryRepository } from './repositories/query/comments-query.repository';
import { CreateCommentUseCase } from './application/usecases/create-comment.usecase';
import { UserPlatformModule } from '../user-platform/user-platform.module';
import { CommentsController } from './api/comments.controller';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateCommentUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Post, Comment]),
    UserPlatformModule,
  ],
  controllers: [
    BlogsController,
    BlogsAdminController,
    PostsController,
    CommentsController,
  ],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    BlogsRepository,
    BlogsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    ...useCases,
  ],
})
export class BlogPlatformModule {}
