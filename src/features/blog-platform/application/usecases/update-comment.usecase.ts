import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateCommentInputDto } from '../../api/input-dto/update-comment-input.dto';
import { CommentsRepository } from '../../repositories/comments.repository';
import { UpdateCommentDto } from '../../../user-platform/dto/update-comment.dto';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';

export class UpdateCommentCommand {
  constructor(public dto: UpdateCommentDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand, void>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { userId, commentId, content } = command.dto;
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException();
    }

    comment.updateContent(content);

    await this.commentsRepository.save(comment);
  }
}
