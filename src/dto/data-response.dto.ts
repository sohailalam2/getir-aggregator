export interface Record {
  key: string;
  createdAt: Date;
  totalCount: number;
}

/**
 * Response DTO for the /data endpoint
 */
export class DataResponseDto {
  code!: number;
  msg!: string;
  records?: Record[];
}
