import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { User } from '../../../user-platform/domain/user.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByIdOrThrow(id: string): Promise<CommentViewDto> {
    const comment = await this.commentsRepository.findOneBy({ id });
    const user = await this.usersRepository.findOneBy({ id: comment.userId });

    if (!comment) {
      throw new NotFoundException();
    }

    return CommentViewDto.mapToView(
      comment,
      null,
      { likesCount: 0, dislikesCount: 0 },
      user?.login ?? 'DELETED',
    );
  }

  // async findAllComments(
  //   query: BlogQueryGetParams,
  // ): Promise<BasePaginationViewDto<BlogViewDto[]>> {
  //   const { searchNameTerm, sortDirection, sortBy, pageSize, pageNumber } =
  //     query;
  //
  //   const builder = this.commentsRepository.createQueryBuilder('b');
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
  //   const blogs = await builder.getMany();
  //
  //   return BasePaginationViewDto.mapToView({
  //     items: blogs.map(BlogViewDto.mapToView),
  //     pageSize,
  //     page: pageNumber,
  //     totalCount: blogsCount,
  //   });
  // }
}
