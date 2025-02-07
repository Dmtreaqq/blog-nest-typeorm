import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeEntity } from '../../../common/domain/baseTypeEntity';
import { Post } from './post.entity';
import { User } from '../../user-platform/domain/user.entity';
import { CreateCommentInputDto } from '../api/input-dto/create-comment-input.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Entity()
export class Comment extends BaseTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  static create(dto: CreateCommentDto): Comment {
    const comment = new Comment();

    comment.content = dto.content;
    comment.postId = dto.postId;
    comment.userId = dto.userId;

    return comment;
  }

  updateContent(content: string) {
    this.content = content;
  }
}
