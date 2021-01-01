import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { DataRequestDto, DataResponseDto, HealthDto } from '../dto';
import { Records, RecordsDocument } from '../schema';

describe('AppController', () => {
  let appController: AppController;
  let recordsModel: Model<RecordsDocument>;

  let spyRecordsModel: jest.SpyInstance;

  const recordsModelToken = getModelToken(Records.name);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: recordsModelToken,
          useValue: {
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    recordsModel = app.get<Model<RecordsDocument>>(recordsModelToken);

    spyRecordsModel = jest.spyOn(recordsModel, 'aggregate');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(recordsModel).toBeDefined();
    expect(spyRecordsModel).toBeDefined();
  });

  describe('heath endpoint', () => {
    it('should return the health status object', async () => {
      const healthStatus: HealthDto = await appController.getHealth();

      expect(healthStatus).toBeDefined();
      expect(healthStatus.status).toEqual('OK');
    });
  });

  describe('data endpoint', () => {
    it('should return correct records', async () => {
      const req: DataRequestDto = {
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
      };

      const dbRes = [
        {
          _id: '5ee21588e07f053f990cec7d',
          key: 'ibfRLaFT',
          value: 'AlpgKxsdliUG',
          createdAt: new Date('2016-12-25T16:43:27.909Z'),
          counts: [341, 997, 1554],
          totalCount: 2892,
        },
        {
          _id: '5ee21587e07f053f990cebb5',
          key: 'pxClAvll',
          value: 'pxWfhQUtqkvS',
          createdAt: new Date('2016-12-19T10:00:40.050Z'),
          counts: [1179, 15, 1578],
          totalCount: 2772,
        },
      ];

      spyRecordsModel.mockReturnValue({
        async exec() {
          return dbRes;
        },
      });

      const res: DataResponseDto = await appController.fetchData(req);

      expect(spyRecordsModel).toBeCalledWith([
        {
          $match: {
            createdAt: {
              $gte: new Date(req.startDate),
              $lt: new Date(req.endDate),
            },
          },
        },
        { $addFields: { totalCount: { $sum: '$counts' } } },
        { $match: { totalCount: { $gte: req.minCount, $lt: req.maxCount } } },
      ]);

      expect(res).toBeDefined();
      expect(res.code).toEqual(0);
      expect(res.msg).toEqual('success');
      expect(res.records.length).toEqual(dbRes.length);
      expect(res.records[0].createdAt).toEqual(dbRes[0].createdAt);
      expect(res.records[0].key).toEqual(dbRes[0].key);
      expect(res.records[0].totalCount).toEqual(dbRes[0].totalCount);
    });
  });
});
