import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import { BasePaginationViewDto } from '../../../../common/dto/base-pagination.view-dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { User } from '../../../user-platform/domain/user.entity';
import { CommentsQueryGetParams } from '../../api/input-dto/get-comments-query.dto';

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

  async findAllComments(
    query: CommentsQueryGetParams,
    postId: string,
    userId?: string,
  ): Promise<BasePaginationViewDto<CommentViewDto[]>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = query;

    const builder = this.commentsRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'u')
      .where('c.postId = :postId', { postId });

    if (userId) {
      // TODO
    }

    const commentsCount = await builder.getCount();

    builder
      .orderBy(
        `c.${sortBy}`,
        `${sortDirection.toUpperCase() as 'ASC' | 'DESC'}`,
      )
      .limit(pageSize)
      .offset(query.calculateSkip());

    const comments = await builder.getMany();

    return BasePaginationViewDto.mapToView({
      items: comments.map((comment) => {
        return CommentViewDto.mapToView(
          comment,
          null,
          { likesCount: 0, dislikesCount: 0 },
          comment.user.login,
        );
      }),
      pageSize,
      page: pageNumber,
      totalCount: commentsCount,
    });
  }
}
