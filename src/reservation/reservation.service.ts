import { Injectable, UseGuards, BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './schema/reservation.schema';
import { Model } from 'mongoose';
import { Coworkingspace } from 'src/coworkingspace/schemas/coworkingspace.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    const reservationCount = await this.reservationModel.countDocuments({
      user: userId,
      status: 'reserved',
    });

    if (reservationCount >= 3) {
      throw new BadRequestException('You already have 3 active reservations.');
    }

    const newReservation = new this.reservationModel({
      ...createReservationDto,
      user: userId, // Automatically set user ID
    });
    return newReservation.save();
  }

  findAll() {
    return this.reservationModel.find().exec();
  }

  findOne(id: string) {
    return this.reservationModel.findById(id).exec();
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: string) {
    return `This action removes a #${id} reservation`;
  }
}
