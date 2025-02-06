import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { Blog } from '../../domain/blog.entity';
import { UpdateBlogInputDto } from '../../api/input-dto/update-blog-input.dto';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand, Blog>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<Blog> {
    const blog = await this.blogsRepository.findById(command.id);

    blog.updateBlog(command.dto);

    const updatedBlog = await this.blogsRepository.save(blog);

    return updatedBlog;
  }
}
