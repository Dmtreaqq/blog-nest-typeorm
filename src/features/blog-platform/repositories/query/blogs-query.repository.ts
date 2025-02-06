import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

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
}
