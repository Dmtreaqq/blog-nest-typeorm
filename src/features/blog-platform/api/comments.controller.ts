import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, Put,
  UseGuards,
} from '@nestjs/common';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { JwtOptionalAuthGuard } from '../../../common/guards/jwt-optional-auth.guard';
import { CommentsQueryRepository } from '../repositories/query/comments-query.repository';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { UpdateCommentInputDto } from './input-dto/update-comment-input.dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getCommentById(@Param() params: IdInputDto) {
    return this.commentsQueryRepository.findByIdOrThrow(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteCommentById(
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
  ) {
    await this.commandBus.execute(
      new DeleteCommentCommand(params.id, userContext.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateCommentById(
    @Param() params: IdInputDto,
    @GetUser() userContext: UserContext,
    @Body() dto: UpdateCommentInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateCommentCommand({
        userId: userContext.id,
        commentId: params.id,
        content: dto.content,
      }),
    );
  }
}
