import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Records {
  @Prop()
  key!: string;

  @Prop()
  createdAt!: Date;

  @Prop([Number])
  counts!: number[];

  @Prop()
  value!: string;

  totalCount!: number;
}

export type RecordsDocument = Records & Document;

export const RecordsSchema = SchemaFactory.createForClass(Records);
