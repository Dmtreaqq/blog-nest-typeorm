import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PREFIX } from '../../../src/setup/global-prefix.setup';
import { API_PATH } from '../../../src/common/constants';
import {
  basicAuthHeader,
  UsersTestManager,
} from '../../helpers/users-test-manager';
import { createUserInput } from '../../helpers/inputs';
import { initSettings } from '../../helpers/init-settings';
import { randomUUID } from 'node:crypto';

describe('Users Negative (e2e)', () => {
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
    // await mongoServer.stop();
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

  it('should return 400 when POST a user with same LOGIN twice', async () => {
    await usersTestManager.createUser(createUserInput);

    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send(createUserInput)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: 'User already exists',
        },
      ],
    });
  });

  it('should return 400 when POST a user with same EMAIL twice', async () => {
    await usersTestManager.createUser(createUserInput);

    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send(createUserInput)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: 'User already exists',
        },
      ],
    });
  });

  it('should return 400 when DELETE not existing user', async () => {
    const userId = randomUUID();

    await request(app.getHttpServer())
      .del(`${API_PREFIX}${API_PATH.USERS}/${userId}`)
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return 400 when POST a user with incorrect LOGIN', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, login: 123 })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'login',
          message: 'login must be a string',
        },
      ],
    });
  });

  it('should return 400 when POST a user with short LOGIN', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, login: 'c2' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'login',
          message: 'login must be longer than or equal to 3 characters',
        },
      ],
    });
  });

  it('should return 400 when POST a user with long LOGIN', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, login: 'hellodima11' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'login',
          message: 'login must be shorter than or equal to 10 characters',
        },
      ],
    });
  });

  it('should return 400 when POST a user with incorrect PASSWORD', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, password: 123456 })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'password',
          message: 'password must be a string',
        },
      ],
    });
  });

  it('should return 400 when POST a user with short PASSWORD', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, password: 'pass5' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'password',
          message: 'password must be longer than or equal to 6 characters',
        },
      ],
    });
  });

  it('should return 400 when POST a user with long PASSWORD', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, password: 'a'.repeat(21) })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'password',
          message: 'password must be shorter than or equal to 20 characters',
        },
      ],
    });
  });

  it('should return 400 when POST a user with incorrect EMAIL', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, email: 'incorrect' })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: 'email must be an email',
        },
      ],
    });
  });

  it('should return 400 when POST a user with number EMAIL', async () => {
    const response = await request(app.getHttpServer())
      .post(API_PREFIX + API_PATH.USERS)
      .send({ ...createUserInput, email: 123456 })
      .set('authorization', basicAuthHeader)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          field: 'email',
          message: 'email must be a string',
        },
      ],
    });
  });
});
