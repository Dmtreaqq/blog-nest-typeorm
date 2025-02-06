import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/query/blogs-query.repository';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { BlogQueryGetParams } from './input-dto/get-blogs-query.dto';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';

@Controller(['blogs', 'sa/blogs'])
export class BlogsController {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

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
}
