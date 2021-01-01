import { IsString, IsNotEmpty, IsInt, Min, Validate } from 'class-validator';
import { Type } from 'class-transformer';

export class DataRequestDto {
  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  endDate!: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  minCount!: number;

  @IsInt()
  @Min(1)
  @Validate((dto) => dto.minCount < dto.maxCount)
  @Type(() => Number)
  maxCount!: number;
}
