import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { JwtOptionalAuthGuard } from '../../../common/guards/jwt-optional-auth.guard';
import { CommentsQueryRepository } from '../repositories/query/comments-query.repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getCommentById(@Param() params: IdInputDto) {
    return this.commentsQueryRepository.findByIdOrThrow(params.id);
  }
}
