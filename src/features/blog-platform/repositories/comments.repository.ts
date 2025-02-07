import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async save(blog: Comment): Promise<Comment> {
    return this.commentsRepository.save(blog);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentsRepository.findOneBy({ id });
  }

  async delete(id: string) {
    await this.commentsRepository.softDelete({ id });
  }
}
