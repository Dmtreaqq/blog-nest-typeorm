import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostForBlogInputDto } from '../../api/input-dto/create-post-input.dto';
import { PostsRepository } from '../../repositories/posts.repository';
import { Post } from '../../domain/post.entity';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class CreatePostCommand {
  constructor(
    public blogId: string,
    public dto: CreatePostForBlogInputDto,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand, string>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    const post = Post.create({
      ...command.dto,
      blogName: blog.name,
      blogId: blog.id,
    });

    const createdPost = await this.postsRepository.save(post);

    return createdPost.id;
  }
}
