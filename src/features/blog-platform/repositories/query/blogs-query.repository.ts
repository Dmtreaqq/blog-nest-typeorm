import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { BlogQueryGetParams } from '../../api/input-dto/get-blogs-query.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}

  async findByIdOrThrow(id: string): Promise<BlogViewDto> {
    const blog = await this.blogsRepository.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException();
    }

    return BlogViewDto.mapToView(blog);
  }

  async findAllBlogs(
    query: BlogQueryGetParams,
  ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
    const { searchNameTerm, sortDirection, sortBy, pageSize, pageNumber } =
      query;

    const builder = this.blogsRepository.createQueryBuilder('b');

    if (searchNameTerm) {
      builder.where(`b.name ILIKE '%${searchNameTerm}%'`);
    }

    const blogsCount = await builder.getCount();

    builder
      .orderBy(
        `b.${sortBy}`,
        `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
      )
      .limit(pageSize)
      .offset(query.calculateSkip());

    const blogs = await builder.getMany();

    return BasePaginationViewDto.mapToView({
      items: blogs.map(BlogViewDto.mapToView),
      pageSize,
      page: pageNumber,
      totalCount: blogsCount,
    });
  }
}
