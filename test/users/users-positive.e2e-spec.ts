import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PREFIX } from '../../src/setup/global-prefix.setup';
import { API_PATH } from '../../src/common/constants';
import { UsersTestManager } from '../helpers/users-test-manager';
import { createUserInput, basicAuthHeader } from '../helpers/inputs';
import { initSettings } from '../helpers/init-settings';

describe('Users Positive (e2e)', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;

    usersTestManager = result.usersTestManager;

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

  it('should POST a user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send(createUserInput)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      email: createUserInput.email,
      login: createUserInput.login,
      id: expect.any(String),
      createdAt: expect.any(String),
    });

    await request(app.getHttpServer())
      .get(`${API_PREFIX}${API_PATH.USERS}/${response.body.id}`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.OK, response.body);
  });

  it('Should DELETE a user successfully', async () => {
    const user = await usersTestManager.createUser({
      ...createUserInput,
      login: 'login1',
      email: 'email1@email.com',
    });

    await request(app.getHttpServer())
      .del(`${API_PREFIX}${API_PATH.USERS}/${user.id}`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`${API_PREFIX}${API_PATH.USERS}/${user.id}`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.NOT_FOUND);
  });
  //
  // it('should GET users by searchEmailTerm successfully', async () => {
  //   const [user1, user2] = await usersTestManager.createSeveralUsers(2);
  //
  //   const response1 = await request(app.getHttpServer())
  //     .get(`${API_PREFIX}${API_PATH.USERS}/?searchEmailTerm=test`)
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //
  //   expect(response1.body.items.length).toEqual(2);
  //   expect(response1.body.items).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         ...user1,
  //         id: expect.any(String),
  //         createdAt: expect.any(String),
  //       }),
  //       expect.objectContaining({
  //         ...user2,
  //         id: expect.any(String),
  //         createdAt: expect.any(String),
  //       }),
  //     ]),
  //   );
  // });
  //
  // it('should GET users by searchLoginTerm successfully', async () => {
  //   const [user1] = await usersTestManager.createSeveralUsers(2);
  //
  //   const response1 = await request(app.getHttpServer())
  //     .get(`${API_PREFIX}${API_PATH.USERS}/?searchLoginTerm=test0`)
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //
  //   expect(response1.body.items.length).toEqual(1);
  //   expect(response1.body.items).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         ...user1,
  //         id: expect.any(String),
  //         createdAt: expect.any(String),
  //       }),
  //     ]),
  //   );
  // });
  //
  // it('should GET users with pagination successfully', async () => {
  //   await usersTestManager.createSeveralUsers(4);
  //
  //   const response1 = await request(app.getHttpServer())
  //     .get(`${API_PREFIX}${API_PATH.USERS}/?pageNumber=2&pageSize=2`)
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //   expect(response1.body).toEqual({
  //     page: 2,
  //     pageSize: 2,
  //     totalCount: 4,
  //     pagesCount: 2,
  //     items: expect.any(Array),
  //   });
  // });
  //
  // it('should GET users with sorting successfully', async () => {
  //   await usersTestManager.createSeveralUsers(4);
  //
  //   // Default sortDir = desc
  //   const response1 = await request(app.getHttpServer())
  //     .get(`${API_PREFIX}${API_PATH.USERS}/?sortBy=login`)
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //   console.log(response1.body);
  //   expect(response1.body.items[0].login).toEqual('test3');
  //   expect(response1.body.items[3].login).toEqual('test0');
  // });
  //
  // it('should GET users with sorting (asc) successfully', async () => {
  //   await usersTestManager.createSeveralUsers(4);
  //
  //   const response1 = await request(app.getHttpServer())
  //     .get(`${API_PREFIX}${API_PATH.USERS}/?sortBy=login&sortDirection=asc`)
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //   expect(response1.body.items[0].login).toEqual('test0');
  //   expect(response1.body.items[3].login).toEqual('test3');
  // });
  //
  // it('should GET users with all query parameters used', async () => {
  //   await usersTestManager.createSeveralUsers(4);
  //
  //   const response1 = await request(app.getHttpServer())
  //     .get(
  //       `${API_PREFIX}${API_PATH.USERS}/?sortBy=login&sortDirection=asc&searchEmailTerm=test&searchLoginTerm=test`,
  //     )
  //     .set('authorization', basicAuthHeader)
  //     .expect(HttpStatus.OK);
  //   expect(response1.body.items.length).toEqual(4);
  //   expect(response1.body.items[0].login).toEqual('test0');
  //   expect(response1.body.items[1].login).toEqual('test1');
  //   expect(response1.body.items[2].login).toEqual('test2');
  //   expect(response1.body.items[3].login).toEqual('test3');
  // });
});
