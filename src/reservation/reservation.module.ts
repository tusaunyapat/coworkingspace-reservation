import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from './schema/reservation.schema';
import { Reservation } from './schema/reservation.schema';
import { Coworkingspace } from 'src/coworkingspace/schemas/coworkingspace.schema';
import { CoworkingspaceSchema } from 'src/coworkingspace/schemas/coworkingspace.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: Coworkingspace.name,
        schema: CoworkingspaceSchema,
      },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
