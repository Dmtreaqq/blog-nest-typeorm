import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { IdInputDto } from '../../../common/dto/id.input-dto';

import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';

import { PostQueryGetParams } from './input-dto/get-posts-query.dto';

import { PostsQueryRepository } from '../repositories/query/posts-query.repository';
import { PostViewDto } from './view-dto/post.view-dto';
import { JwtOptionalAuthGuard } from '../../../common/guards/jwt-optional-auth.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateCommentInputDto } from './input-dto/create-comment-input.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { CreateCommentCommand } from '../application/usecases/create-comment.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../repositories/query/comments-query.repository';
import { CommentsQueryGetParams } from './input-dto/get-comments-query.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getById(@Param() params: IdInputDto) {
    return this.postsQueryRepository.findByIdOrThrow(params.id);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getAll(
    @Query() query: PostQueryGetParams,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.findAllPosts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Body() commentInputDto: CreateCommentInputDto,
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ) {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand({
        ...commentInputDto,
        postId: params.id,
        userId: userContext.id,
      }),
    );

    return this.commentsQueryRepository.findByIdOrThrow(commentId);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id/comments')
  async getCommentsForPost(
    @Param() params: IdInputDto,
    @Query() query: CommentsQueryGetParams,
    @GetUser() userContext: UserContext,
  ) {
    return this.commentsQueryRepository.findAllComments(
      query,
      params.id,
      userContext.id,
    );
  }
}
