import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/query/blogs-query.repository';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { BlogQueryGetParams } from './input-dto/get-blogs-query.dto';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { PostQueryGetParams } from './input-dto/get-posts-query.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { PostsQueryRepository } from '../repositories/query/posts-query.repository';

@Controller(['blogs', 'sa/blogs'])
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get(':id')
  async getById(@Param() params: IdInputDto) {
    return this.blogsQueryRepository.findByIdOrThrow(params.id);
  }

  @Get()
  async getAll(
    @Query() query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query);
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Query() query: PostQueryGetParams,
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ) {
    return this.postsQueryRepository.findAllPostsForBlog(
      query,
      params.id,
      userContext.id,
    );
  }
}
