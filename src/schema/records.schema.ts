import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Mongoose database schema for the records collection
 */
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

  // This is a computed property and hence not a prop
  totalCount!: number;
}

export type RecordsDocument = Records & Document;

export const RecordsSchema = SchemaFactory.createForClass(Records);
