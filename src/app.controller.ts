import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AppService } from './app.service';
import { DataRequestDto, DataResponseDto, HealthDto, Record } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /health
   *
   * Get the application health.
   * This endpoint also sends the application name and version for simplicity reasons
   */
  @Get(['', '/health'])
  async getHealth(): Promise<HealthDto> {
    return this.appService.getHealth();
  }

  /**
   * Get the data from the database based on the filter criteria
   *
   * @param filter The filter critera
   * @param filter.startDate The start date for filtering the records
   * @param filter.endDate The end date for filtering the records
   * @param filter.minCount The minimum count
   * @param filter.maxCount The maximum count
   */
  @Post('/data')
  @HttpCode(200)
  async fetchData(@Body() filter: DataRequestDto): Promise<DataResponseDto> {
    try {
      const records: Record[] = await this.appService.fetchData(
        new Date(filter.startDate),
        new Date(filter.endDate),
        filter.minCount,
        filter.maxCount,
      );

      return {
        code: 0,
        msg: 'success',
        records,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
