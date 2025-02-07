import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { API_PREFIX } from '../../src/setup/global-prefix.setup';
// import { delay } from './delay';
import { CreatePostInputDto } from '../../src/features/blog-platform/api/input-dto/create-post-input.dto';
import { API_PATH } from '../../src/common/constants';
import { PostViewDto } from '../../src/features/blog-platform/api/view-dto/post.view-dto';
import { delay } from './delay';
import { basicAuthHeader } from './users-test-manager';

export class PostsTestManager {
  constructor(private app: INestApplication) {}
  async createPost(
    blogId: string,
    createModel: CreatePostInputDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<PostViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`${API_PREFIX}${API_PATH.BLOGS}/${blogId}/posts`)
      .send(createModel)
      .set('authorization', basicAuthHeader)
      .expect(statusCode);

    return response.body;
  }

  async createPosts(blogId: string, count: number) {
    const postsPromises = [] as Promise<PostViewDto>[];

    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = this.createPost(blogId, {
        blogId,
        title: `postTitle` + i,
        shortDescription: `post${i}description`,
        content: `cnt${i}`,
      });
      postsPromises.push(response);
    }

    return Promise.all(postsPromises);
  }
}
