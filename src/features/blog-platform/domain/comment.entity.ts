import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeEntity } from '../../../common/domain/baseTypeEntity';
import { Post } from './post.entity';
import { User } from '../../user-platform/domain/user.entity';

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
}
