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

  /**
   * Return the application health
   *
   * TODO: check for mongodb connection before sending a success response
   */
  async getHealth(): Promise<HealthDto> {
    return {
      name,
      version,
      status: 'OK',
    };
  }

  /**
   * Fetch data from the mongodb based on the following filter criteria
   * and aggregate the results to evaluate the totalCount
   *
   * @param startDate The start date for filtering the records
   * @param endDate The end date for filtering the records
   * @param minCount The minimum count
   * @param maxCount The maximum count
   */
  async fetchData(
    startDate: Date,
    endDate: Date,
    minCount: number,
    maxCount: number,
  ): Promise<Record[]> {
    // Using mongodb aggregate pipeline to do the heavy lifting
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
