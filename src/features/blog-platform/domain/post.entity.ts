import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeEntity } from '../../../common/domain/baseTypeEntity';
import { CreatePostInputDto } from '../api/input-dto/create-post-input.dto';
import { CreatePostDto } from '../dto/create-post.dto';

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

  @Column({ type: 'varchar' })
  blogId: string;

  static create(dto: CreatePostDto): Post {
    const post = new Post();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    return post;
  }
}
