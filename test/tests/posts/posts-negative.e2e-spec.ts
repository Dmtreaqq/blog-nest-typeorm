import { HttpStatus, INestApplication } from '@nestjs/common';
import { BlogsTestManager } from '../../helpers/blogs-test-manager';
import { PostsTestManager } from '../../helpers/posts-test-manager';
import * as request from 'supertest';
import { API_PREFIX } from '../../../src/setup/global-prefix.setup';
import { API_PATH } from '../../../src/common/constants';
import { createBlogInput, createPostInput } from '../../helpers/inputs';
import { basicAuthHeader } from '../../helpers/users-test-manager';
import { initSettings } from '../../helpers/init-settings';
import { randomUUID } from 'node:crypto';

describe('Posts Negative (e2e)', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;
  let postsTestManager: PostsTestManager;
  let randomId: any;

  beforeAll(async () => {
    randomId = randomUUID();
    const result = await initSettings();
    app = result.app;
    blogsTestManager = result.blogsTestManager;
    postsTestManager = result.postsTestManager;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await request(app.getHttpServer()).delete(
      `${API_PREFIX}${API_PATH.TEST_DELETE}`,
    );
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete(
      `${API_PREFIX}${API_PATH.TEST_DELETE}`,
    );
  });

  it('should return 404 for GET not existing post', async () => {
    await request(app.getHttpServer())
      .get(`${API_PREFIX}${API_PATH.POSTS}/${randomId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 404 for DELETE not existing post', async () => {
    await request(app.getHttpServer())
      .delete(`${API_PREFIX}${API_PATH.POSTS}/${randomId}`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 404 for PUT not existing post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);

    await request(app.getHttpServer())
      .put(`${API_PREFIX}${API_PATH.POSTS}/${randomId}`)
      .send({ ...createPostInput, blogId: blog.id })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 400 for incorrect TITLE while POST post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);

    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.POSTS)
      .send({ ...createPostInput, blogId: blog.id, title: '' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'title',
          message: 'title should not be empty',
        },
      ],
    });
  });

  it('should return 400 for incorrect TITLE length while POST post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.POSTS)
      .send({
        ...createPostInput,
        blogId: blog.id,
        title: '31sym_789012345678901234567jjkkjjjkjk8901',
      })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'title',
          message: 'title must be shorter than or equal to 30 characters',
        },
      ],
    });
  });

  it('should return 400 for not existing BlogId while POST post', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.POSTS)
      .send({ ...createPostInput, blogId: randomId })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'blogId',
          message: `Blog ${randomId} not exist`,
        },
      ],
    });
  });

  it('should return 400 for not incorrect BlogId while POST post', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.POSTS)
      .send({ ...createPostInput, blogId: '123' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'blogId',
          message: 'blogId must be a mongodb id',
        },
      ],
    });
  });

  it('should return 400 for not incorrect BlogId while PUT post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);
    const post = await postsTestManager.createPost(blog.id, {
      ...createPostInput,
      blogId: blog.id,
    });

    const response = await request(app.getHttpServer())
      .put(`${API_PREFIX}${API_PATH.POSTS}/${post.id}`)
      .send({ ...createPostInput, blogId: '123' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'blogId',
          message: 'blogId must be a mongodb id',
        },
      ],
    });
  });

  it('should return 400 for incorrect TITLE while PUT post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);
    const post = await postsTestManager.createPost(blog.id, {
      ...createPostInput,
      blogId: blog.id,
    });

    const editResponse = await request(app.getHttpServer())
      .put(`${API_PREFIX}${API_PATH.POSTS}/${post.id}`)
      .send({ ...createPostInput, blogId: blog.id, title: '' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'title',
          message: 'title should not be empty',
        },
      ],
    });
  });

  it('should return 400 for incorrect TITLE length while PUT post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);
    const post = await postsTestManager.createPost(blog.id, {
      ...createPostInput,
      blogId: blog.id,
    });

    const editResponse = await request(app.getHttpServer())
      .put(`${API_PREFIX}${API_PATH.POSTS}/${post.id}`)
      .send({
        ...createPostInput,
        blogId: blog.id,
        title: '31sym_789012345678901234567jjkkjjjkjk8901',
      })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'title',
          message: 'title must be shorter than or equal to 30 characters',
        },
      ],
    });
  });

  it('should return 400 for incorrect POST_ID length while PUT post', async () => {
    const blog = await blogsTestManager.createBlog(createBlogInput);

    const editResponse = await request(app.getHttpServer())
      .put(`${API_PREFIX}${API_PATH.POSTS}/12345`)
      .send({ ...createPostInput, blogId: blog.id, title: 'new title' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'id',
          message: 'id must be a mongodb id',
        },
      ],
    });
  });

  it('should return 400 for incorrect POST_ID length while DELETE post', async () => {
    const editResponse = await request(app.getHttpServer())
      .delete(`${API_PREFIX}${API_PATH.POSTS}/12345`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'id',
          message: 'id must be a mongodb id',
        },
      ],
    });
  });

  it('should return 400 for incorrect POST_ID length while GET post', async () => {
    const editResponse = await request(app.getHttpServer())
      .get(`${API_PREFIX}${API_PATH.POSTS}/12345`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'id',
          message: 'id must be a mongodb id',
        },
      ],
    });
  });

  // it('should return 401 when no Auth Header for POST post request', async () => {
  //   await request(app.getHttpServer())
  //     .post(API_PREFIX + API_PATH.POSTS)
  //     .send(blogInput)
  //     .expect(HttpStatus.UNAUTHORIZED);
  // })
  //
  // it('should return 401 when no Auth Header for PUT post request', async () => {
  //   await request(app.getHttpServer())
  //     .put(`${API_PREFIX}${API_PATH.POSTS}/${createdPostId}`)
  //     .send(blogInput)
  //     .expect(HttpStatus.UNAUTHORIZED);
  // })
  //
  // it('should return 401 when no Auth Header for DELETE post request', async () => {
  //   await request(app.getHttpServer())
  //     .delete(`${API_PREFIX}${API_PATH.POSTS}/${createdPostId}`)
  //     .expect(HttpStatus.UNAUTHORIZED);
  // })
  //
  // it('should return 401 when Auth Header is incorrect for DELETE post request', async () => {
  //   await request(app.getHttpServer())
  //     .delete(`${API_PREFIX}${API_PATH.POSTS}/${createdPostId}`)
  //     .set('authorization', 'Basic Test')
  //     .expect(HttpStatus.UNAUTHORIZED);
  // })

  it('should return 400 for GET post sortBy as number', async () => {
    const response = await request(app.getHttpServer())
      .get(`${API_PREFIX}${API_PATH.POSTS}/?sortBy=67`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'sortBy',
          message:
            'sortBy must be one of the following values: createdAt, title, shortDescription, content, blogId, blogName',
        },
      ],
    });
  });
});
