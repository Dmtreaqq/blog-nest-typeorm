import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../repositories/comments.repository';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { PostsRepository } from '../../repositories/posts.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, string>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const user = await this.usersRepository.findById(command.dto.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const post = await this.postsRepository.findById(command.dto.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const comment = Comment.create(command.dto);
    const createdComment = await this.commentsRepository.save(comment);

    return createdComment.id;
  }
}
