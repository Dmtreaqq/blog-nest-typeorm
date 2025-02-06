import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { CreateBlogInputDto } from './input-dto/create-blog-input.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog-input.dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { BlogsQueryRepository } from '../repositories/query/blogs-query.repository';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { BlogQueryGetParams } from './input-dto/get-blogs-query.dto';
import { CreatePostForBlogInputDto } from './input-dto/create-post-input.dto';
import { PostsQueryRepository } from '../repositories/query/posts-query.repository';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostInputDto } from './input-dto/update-post-input.dto';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { UserContext } from '../../../common/dto/user-context.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { PostQueryGetParams } from './input-dto/get-posts-query.dto';

@Controller('sa/blogs')
export class BlogsAdminController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() dto: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));

    return this.blogsQueryRepository.findByIdOrThrow(blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editPost(@Param() params: IdInputDto, @Body() dto: UpdatePostInputDto) {
    return this.commandBus.execute(
      new UpdatePostCommand(params.id, params.postId, dto),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(@Param() params: IdInputDto) {
    await this.commandBus.execute(
      new DeletePostCommand(params.id, params.postId),
    );
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAll(
    @Query() query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param() params: IdInputDto,
    @Body() dto: UpdateBlogInputDto,
  ) {
    return this.commandBus.execute(new UpdateBlogCommand(params.id, dto));
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() params: IdInputDto) {
    await this.commandBus.execute(new DeleteBlogCommand(params.id));
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostForBlog(
    @Body() dto: CreatePostForBlogInputDto,
    @Param() params: IdInputDto,
  ) {
    const postId = await this.commandBus.execute(
      new CreatePostCommand(params.id, dto),
    );

    return this.postsQueryRepository.findByIdOrThrow(postId);
  }
}
