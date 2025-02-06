import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../repositories/posts.repository';
import { BlogsRepository } from '../../repositories/blogs.repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
  implements ICommandHandler<DeletePostCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const isBlogExist = await this.blogsRepository.blogIsExist(command.blogId);
    if (!isBlogExist) {
      throw new NotFoundException('Blog not exist');
    }

    const post = await this.postsRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(command.postId);
  }
}
