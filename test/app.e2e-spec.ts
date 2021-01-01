import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { assert } from 'console';

import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/utils/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        dismissDefaultMessages: false,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .then((res) => {
        assert(res.body.status, 'OK');
      });
  });

  it('/data (POST)', async () => {
    return request(app.getHttpServer())
      .post('/data')
      .send({
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
      })
      .expect(200)
      .then((res) => {
        assert(res.body.code, 0);
        assert(res.body.msg, 'success');
        assert(res.body.records.length, 2);
      });
  });
});
