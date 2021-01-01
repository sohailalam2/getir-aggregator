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

  @Get(['', '/health'])
  async getHealth(): Promise<HealthDto> {
    return this.appService.getHealth();
  }

  @Post('/data')
  @HttpCode(200)
  async fetchData(@Body() req: DataRequestDto): Promise<DataResponseDto> {
    try {
      const records: Record[] = await this.appService.fetchData(
        new Date(req.startDate),
        new Date(req.endDate),
        req.minCount,
        req.maxCount,
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
