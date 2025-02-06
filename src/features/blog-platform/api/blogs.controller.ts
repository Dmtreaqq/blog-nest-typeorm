import { Controller, Get, Param } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/query/blogs-query.repository';
import { IdInputDto } from '../../../common/dto/id.input-dto';

@Controller(['blogs', 'sa/blogs'])
export class BlogsController {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  @Get(':id')
  async getById(@Param() params: IdInputDto) {
    return this.blogsQueryRepository.findByIdOrThrow(params.id);
  }
}
