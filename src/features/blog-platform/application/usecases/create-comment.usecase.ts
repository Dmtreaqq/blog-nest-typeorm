import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../repositories/comments.repository';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, string>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const comment = Comment.create(command.dto);

    const createdComment = await this.commentsRepository.save(comment);

    return createdComment.id;
  }
}
