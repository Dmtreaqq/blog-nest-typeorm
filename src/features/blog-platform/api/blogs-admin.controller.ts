import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { CreateBlogInputDto } from './input-dto/create-blog-input.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog-input.dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { BlogsQueryRepository } from '../repositories/query/blogs-query.repository';

@Controller('sa/blogs')
export class BlogsAdminController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() dto: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));

    return this.blogsQueryRepository.findByIdOrThrow(blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param() params: IdInputDto,
    @Body() dto: UpdateBlogInputDto,
  ) {
    return this.commandBus.execute(new UpdateBlogCommand(params.id, dto));
  }
}
