import { Controller, Get, Param, Query } from '@nestjs/common';

import { IdInputDto } from '../../../common/dto/id.input-dto';

import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';

import { PostQueryGetParams } from './input-dto/get-posts-query.dto';

import { PostsQueryRepository } from '../repositories/query/posts-query.repository';
import { PostViewDto } from './view-dto/post.view-dto';

@Controller('posts')
export class PostsController {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  @Get(':id')
  async getById(@Param() params: IdInputDto) {
    return this.postsQueryRepository.findByIdOrThrow(params.id);
  }

  @Get()
  async getAll(
    @Query() query: PostQueryGetParams,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.findAllPosts(query);
  }
}
