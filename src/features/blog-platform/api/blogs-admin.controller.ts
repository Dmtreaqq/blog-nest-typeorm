import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { CreateBlogInputDto } from './input-dto/create-blog-input.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';

@Controller('sa/blogs')
export class BlogsAdminController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() dto: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));

    // return this.blogsQueryRepository.getByIdOrThrow(blogId);
  }
}
