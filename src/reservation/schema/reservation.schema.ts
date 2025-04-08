import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  coworkingspaceId: string;
  @Prop({ required: true })
  status: string;
  @Prop({ required: true })
  date: string;
  @Prop({ required: true })
  startTime: string;
  @Prop({ required: true })
  endTime: string;
}
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
