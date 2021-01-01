import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

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
    it('should fail on invalid dto when missing startDate', async () => {
      const dto = new DataRequestDto();
      dto.endDate = '2018-02-02';
      dto.minCount = 2700;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.isNotEmpty).toEqual(
        'startDate should not be empty',
      );
    });

    it('should fail on invalid dto when missing endDate', async () => {
      const dto = new DataRequestDto();
      dto.startDate = '2018-02-02';
      dto.minCount = 2700;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.isNotEmpty).toEqual(
        'endDate should not be empty',
      );
    });

    it('should fail on invalid dto when wrong startDate format', async () => {
      const dto = new DataRequestDto();
      dto.startDate = '01-26';
      dto.endDate = '2018-02-02';
      dto.minCount = 2700;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.IsOnlyDate).toEqual(
        'Please provide only date like 2020-12-08',
      );
    });

    it('should fail on invalid dto when wrong endDate format', async () => {
      const dto = new DataRequestDto();
      dto.startDate = '2016-01-26';
      dto.endDate = '02-02';
      dto.minCount = 2700;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.IsOnlyDate).toEqual(
        'Please provide only date like 2020-12-08',
      );
    });

    it('should fail on invalid dto when negative minCount', async () => {
      const dto = new DataRequestDto();
      dto.startDate = '2016-01-26';
      dto.endDate = '2018-02-02';
      dto.minCount = -100;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.min).toEqual(
        'minCount must not be less than 0',
      );
    });

    it('should fail on invalid dto when minCount greater than maxCount', async () => {
      const dto = new DataRequestDto();
      dto.startDate = '2016-01-26';
      dto.endDate = '2018-02-02';
      dto.minCount = 5000;
      dto.maxCount = 3000;

      const errors = await validate(dto);

      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.IsLessThan).toEqual(
        'minCount must be less than maxCount',
      );
    });

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
