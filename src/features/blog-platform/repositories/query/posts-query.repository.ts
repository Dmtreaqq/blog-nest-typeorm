import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
// import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
// import { PostQueryGetParams } from '../../api/input-dto/get-posts-query.dto';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
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

  // async findAllBlogs(
  //   query: BlogQueryGetParams,
  // ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
  //   const { searchNameTerm, sortDirection, sortBy, pageSize, pageNumber } =
  //     query;
  //
  //   const builder = this.blogsRepository.createQueryBuilder('b');
  //
  //   if (searchNameTerm) {
  //     builder.where(`b.name ILIKE '%${searchNameTerm}%'`);
  //   }
  //
  //   const blogsCount = await builder.getCount();
  //
  //   builder
  //     .orderBy(
  //       `b.${sortBy}`,
  //       `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
  //     )
  //     .limit(pageSize)
  //     .offset(query.calculateSkip());
  //
  //   const users = await builder.getMany();
  //
  //   return BasePaginationViewDto.mapToView({
  //     items: users.map(BlogViewDto.mapToView),
  //     pageSize,
  //     page: pageNumber,
  //     totalCount: blogsCount,
  //   });
  // }
}
