import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { PostQueryGetParams } from '../../api/input-dto/get-posts-query.dto';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { Blog } from '../../domain/blog.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}

  async findByIdOrThrow(id: string): Promise<PostViewDto> {
    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException();
    }

    return PostViewDto.mapToView(
      post,
      null,
      { likesCount: 0, dislikesCount: 0 },
      [],
    );
  }

  async findAllPosts(
    query: PostQueryGetParams,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = query;

    const builder = this.postsRepository.createQueryBuilder('p');

    const postsCount = await builder.getCount();

    builder
      .orderBy(
        `p.${sortBy}`,
        `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
      )
      .limit(pageSize)
      .offset(query.calculateSkip());

    const posts = await builder.getMany();

    return BasePaginationViewDto.mapToView({
      items: posts.map((post) => {
        return PostViewDto.mapToView(
          post,
          null,
          { likesCount: 0, dislikesCount: 0 },
          [],
        );
      }),
      pageSize,
      page: pageNumber,
      totalCount: postsCount,
    });
  }

  async findAllPostsForBlog(
    query: PostQueryGetParams,
    blogId: string,
    userId?: string,
  ): Promise<BasePaginationViewDto<PostViewDto[]>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = query;

    const blog = await this.blogsRepository.existsBy({ id: blogId });

    if (!blog) {
      throw new NotFoundException();
    }

    const builder = this.postsRepository
      .createQueryBuilder('p')
      .where('p.blogId = :blogId', { blogId });

    if (userId) {
      // TODO: Take users reaction to builder (left join)
    }

    const postsCount = await builder.getCount();

    builder
      .orderBy(
        `p.${sortBy}`,
        `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
      )
      .limit(pageSize)
      .offset(query.calculateSkip());

    const posts = await builder.getMany();

    return BasePaginationViewDto.mapToView({
      items: posts.map((post) => {
        return PostViewDto.mapToView(
          post,
          null,
          { likesCount: 0, dislikesCount: 0 },
          [],
        );
      }),
      pageSize,
      page: pageNumber,
      totalCount: postsCount,
    });
  }
}
