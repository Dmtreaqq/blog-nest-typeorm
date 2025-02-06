import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { BlogQueryGetParams } from './input-dto/get-blogs-query.dto';

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
  @Get()
  async getAll(
    @Query() query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAllBlogs(query);
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

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() params: IdInputDto) {
    await this.commandBus.execute(new DeleteBlogCommand(params.id));
  }
}
