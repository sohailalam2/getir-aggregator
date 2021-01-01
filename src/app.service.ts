import { Injectable } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { name, version } from '../package.json';

import { Record } from './dto/data-response.dto';
import { Records, RecordsDocument } from './schema/records.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Records.name) private model: Model<RecordsDocument>,
  ) {}

  async getHealth(): Promise<HealthDto> {
    return {
      name,
      version,
      status: 'OK',
    };
  }

  async fetchData(
    startDate: Date,
    endDate: Date,
    minCount: number,
    maxCount: number,
  ): Promise<Record[]> {
    const records: RecordsDocument[] = await this.model
      .aggregate([
        // first stage, match and filter records
        { $match: { createdAt: { $gte: startDate, $lt: endDate } } },

        // second stage, calculate sum
        { $addFields: { totalCount: { $sum: '$counts' } } },

        // final stage, filter based on totalCount
        { $match: { totalCount: { $gte: minCount, $lt: maxCount } } },
      ])
      .exec();

    return records.map((r) => ({
      createdAt: r.createdAt,
      key: r.key,
      totalCount: r.totalCount,
    }));
  }
}
