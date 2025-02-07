import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsRepository } from '../../repositories/comments.repository';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const user = await this.usersRepository.findById(command.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const comment = await this.commentsRepository.findById(command.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }

    await this.commentsRepository.delete(command.commentId);
  }
}
