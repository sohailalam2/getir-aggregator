export interface Record {
  key: string;
  createdAt: Date;
  totalCount: number;
}

export class DataResponseDto {
  code!: number;
  msg!: string;
  records?: Record[];
}
