import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}

  async findByIdOrThrow(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException();
    }

    return blog;
  }
}
