import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async save(post: Post): Promise<Post> {
    return this.postsRepository.save(post);
  }

  async findById(id: string): Promise<Post | null> {
    return this.postsRepository.findOneBy({ id });
  }

  async delete(id: string) {
    await this.postsRepository.softDelete({ id });
  }
}
