import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}

  async save(blog: Blog): Promise<Blog> {
    return this.blogsRepository.save(blog);
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogsRepository.findOneBy({ id });
  }

  async delete(id: string) {
    await this.blogsRepository.softDelete({ id });
  }

  async blogIsExist(id: string): Promise<boolean> {
    const blog = await this.blogsRepository.findOneBy({ id });

    if (!blog) {
      return false;
    }

    return true;
  }
}
