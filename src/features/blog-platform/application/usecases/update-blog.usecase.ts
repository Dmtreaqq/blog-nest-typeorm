import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { Blog } from '../../domain/blog.entity';
import { UpdateBlogInputDto } from '../../api/input-dto/update-blog-input.dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand, void>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findById(command.id);

    if (!blog) {
      throw new NotFoundException();
    }

    blog.updateBlog(command.dto);

    await this.blogsRepository.save(blog);
  }
}
