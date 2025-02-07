import { Comment } from '../../domain/comment.entity';
import { ReactionStatus } from '../enums/ReactionStatus';

class CommentatorInfo {
  userId: string;
  userLogin: string;
}

class LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
  createdAt!: Date;

  static mapToView(
    comment: Comment,
    userStatus: ReactionStatus | null,
    likesDislikesDto: { likesCount: number; dislikesCount: number },
    userLogin: string,
  ): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin,
    };

    dto.likesInfo = {
      likesCount: Number(likesDislikesDto?.likesCount) ?? 0,
      dislikesCount: Number(likesDislikesDto?.dislikesCount) ?? 0,
      myStatus: userStatus ?? ReactionStatus.None,
    };

    return dto;
  }
}
