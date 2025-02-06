import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdatePostInputDto } from '../../api/input-dto/update-post-input.dto';
import { PostsRepository } from '../../repositories/posts.repository';
import { BlogsRepository } from '../../repositories/blogs.repository';

export class UpdatePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public dto: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdatePostCommand, void>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const isBlogExist = await this.blogsRepository.blogIsExist(command.blogId);
    if (!isBlogExist) {
      throw new NotFoundException('Blog not exist');
    }

    const post = await this.postsRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundException();
    }

    post.updatePost(command.dto);

    await this.postsRepository.save(post);
  }
}
