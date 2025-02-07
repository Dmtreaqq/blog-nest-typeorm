import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTypeEntity } from '../../../common/domain/baseTypeEntity';
import { CreatePostDto } from '../dto/create-post.dto';
import { Blog } from './blog.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Comment } from './comment.entity';

@Entity()
export class Post extends BaseTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  shortDescription: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar' })
  blogName: string;

  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blog)
  blog: Blog;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  static create(dto: CreatePostDto): Post {
    const post = new Post();

    post.blogId = dto.blogId;

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogName = dto.blogName;

    return post;
  }

  updatePost(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
  }
}
