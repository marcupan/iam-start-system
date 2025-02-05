import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('IAM System (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    jest.setTimeout(30000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /users - Register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'testuser',
        password: 'securePassword123',
        roles: ['user'],
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      username: 'testuser',
      roles: ['user'],
    });
  });

  it('POST /auth/login - Login with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'securePassword123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    accessToken = response.body.access_token;
  });

  it('GET /users - Access protected route with JWT token', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('GET /admin-only - Restrict access based on roles (Admin only)', async () => {
    await request(app.getHttpServer())
      .get('/admin-only')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
