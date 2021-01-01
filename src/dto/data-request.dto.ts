import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { IsLessThan } from '../utils/is-less-than.validator';
import { IsOnlyDate } from '../utils/is-only-date.validation';

/**
 * Request DTO with validations for the /data endpoint
 */
export class DataRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOnlyDate()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  @IsOnlyDate()
  endDate!: string;

  @IsInt()
  @Min(0)
  @IsLessThan('maxCount')
  @Type(() => Number)
  minCount!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  maxCount!: number;
}
