import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { CreateBlogInputDto } from '../../api/input-dto/create-blog-input.dto';
import { Blog } from '../../domain/blog.entity';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, string>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const blog = Blog.create({ ...command.dto, isMembership: false });

    const createdBlog = await this.blogsRepository.save(blog);

    return createdBlog.id;
  }
}
