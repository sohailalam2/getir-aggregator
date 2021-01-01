import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { assert } from 'console';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const server: HttpServer = app.getHttpServer();

    return request(server)
      .get('/')
      .expect(200)
      .then((res) => {
        assert(res.body.status, 'OK');
      });
  });
});
