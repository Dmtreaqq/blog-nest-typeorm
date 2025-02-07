import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PREFIX } from '../../src/setup/global-prefix.setup';
import { delay } from './delay';
import { CreateCommentInputDto } from '../../src/features/blog-platform/api/input-dto/create-comment-input.dto';
import { CommentViewDto } from '../../src/features/blog-platform/api/view-dto/comment.view-dto';
import { API_PATH } from '../../src/common/constants';

export class CommentsTestManager {
  constructor(private app: INestApplication) {}
  async createComment(
    createModel: CreateCommentInputDto,
    token: string,
    postId: string,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<CommentViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`${API_PREFIX}${API_PATH.POSTS}/${postId}${API_PATH.COMMENTS}`)
      .send(createModel)
      .set('authorization', `Bearer ${token}`)
      .expect(statusCode);

    return response.body;
  }

  async createComments(count: number, token: string, postId: string) {
    const commentsPromises = [] as Promise<CommentViewDto>[];

    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = this.createComment(
        {
          content: i + `This is a very long comment` + i,
        },
        token,
        postId,
      );
      commentsPromises.push(response);
    }

    return Promise.all(commentsPromises);
  }
}
