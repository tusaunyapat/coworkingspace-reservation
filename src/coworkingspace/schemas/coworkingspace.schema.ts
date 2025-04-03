import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoworkingspaceDocument = Coworkingspace & Document;

@Schema()
export class Coworkingspace {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ match: /^[0-9]{9,10}$/ }) // Allows only 10-15 digit phone numbers
  tel: string;

  @Prop({ required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
  email: string;

  @Prop({ required: true })
  openTime: string;

  @Prop({ required: true })
  closeTime: string;

  @Prop({ required: true, min: 1 })
  num_rooms: number;

  @Prop({ default: 0 })
  num_booked: number;
}
export const CoworkingspaceSchema =
  SchemaFactory.createForClass(Coworkingspace);
