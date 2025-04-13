import {
  Injectable,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './schema/reservation.schema';
import { Model } from 'mongoose';
import { Coworkingspace } from 'src/coworkingspace/schemas/coworkingspace.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { find } from 'rxjs';
import { Role } from 'src/shared/enums/roles.enum';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    @InjectModel(Coworkingspace.name)
    private coworkingspaceModel: Model<Coworkingspace>,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    createReservationDto: CreateReservationDto,
    user: {},
  ): Promise<Reservation> {
    // Step 1: Check if the user already has 3 active reservations

    const reservationCount = await this.reservationModel.countDocuments({
      userId: user['userId'],
      status: 'reserved',
    });

    if (reservationCount >= 3) {
      throw new BadRequestException('You already have 3 active reservations.');
    }

    // Step 2: Check if the coworking space exists
    const coworkingSpace = await this.coworkingspaceModel.findById(
      createReservationDto.coworkingspaceId,
    );

    if (!coworkingSpace) {
      throw new NotFoundException('Coworking space not found');
    }

    if (
      createReservationDto.startTime < coworkingSpace.openTime ||
      createReservationDto.endTime > coworkingSpace.closeTime
    ) {
      throw new BadRequestException(
        'You cannot reserved this duration, due to open hours of coworking space',
      );
    }

    // Step 3: Check if the time slot is available
    // Count the number of reservations that overlap with the requested time slot
    console.log('date', createReservationDto.date);
    const overlappingReservations = await this.reservationModel.find({
      coworkingspaceId: createReservationDto.coworkingspaceId,
      status: 'reserved',
      date: createReservationDto.date,
      $or: [
        {
          startTime: { $lt: createReservationDto.endTime },
          endTime: { $gt: createReservationDto.startTime },
        },
      ],
    });
    console.log('Overlapping reservations:', overlappingReservations);

    // Step 4: If the number of overlapping reservations is already equal to num_rooms, throw an error
    if (overlappingReservations.length >= coworkingSpace.num_rooms) {
      throw new BadRequestException(
        'No available rooms for the selected time slot.',
      );
    }

    // Step 5: Create the new reservation
    const newReservation = new this.reservationModel({
      ...createReservationDto,
      userId: user['userId'], // Automatically set user ID
    });

    // Step 6: Update coworking space's booked room count
    coworkingSpace.num_booked += 1;
    await coworkingSpace.save();

    const reservationDetails = {
      date: createReservationDto.date,
      time: `${createReservationDto.startTime} - ${createReservationDto.endTime}`,
      location: coworkingSpace.address,
      reservedAt: new Date().toDateString(),
    };

    const token = this.mailService.generateVerificationToken(user['email']); // implement this
    console.log('token', token);
    await this.mailService.sendReservationConfirmationEmail(
      user['email'],
      reservationDetails,
    );
    return newReservation.save();
  }

  findAll() {
    return this.reservationModel.find().exec();
  }

  findMy(userId: string) {
    return this.reservationModel
      .find({ userId: userId, status: 'reserved' })
      .exec();
  }

  findOne(id: string) {
    return this.reservationModel.findById(id).exec();
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const coworkingSpace = await this.coworkingspaceModel.findById(
      updateReservationDto.coworkingspaceId,
    );

    if (!coworkingSpace) {
      throw new NotFoundException('Coworking space not found');
    }
    const overlappingReservations = await this.reservationModel.find({
      coworkingspaceId: updateReservationDto.coworkingspaceId,
      $or: [
        {
          startTime: { $lt: updateReservationDto.endTime },
          endTime: { $gt: updateReservationDto.startTime },
        },
      ],
    });
    console.log('Overlapping reservations:', overlappingReservations);

    // Step 4: If the number of overlapping reservations is already equal to num_rooms, throw an error
    if (overlappingReservations.length >= coworkingSpace.num_rooms) {
      throw new BadRequestException(
        'No available rooms for the selected time slot.',
      );
    }
    const updated = await this.reservationModel.findByIdAndUpdate(
      id,
      updateReservationDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Coworking space with ID ${id} not found`);
    }

    return updated;
  }

  checkin(
    id: string,
    userId: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationModel
      .findOneAndUpdate(
        { _id: id, userId: userId },
        { ...updateReservationDto, status: 'checked-in' },
        { new: true },
      )
      .exec()
      .then((reservation) => {
        if (!reservation) {
          throw new NotFoundException(
            'Reservation not found or not owned by user',
          );
        }
        return reservation;
      });
  }
  async remove(id: string, userId: string, userRole: string) {
    const myReservations = await this.findMy(userId);
    const reservation = myReservations.find((res) => res._id.toString() === id);
    if (userRole === Role.ADMIN) {
      return this.reservationModel.findByIdAndDelete(id).exec();
    }
    if (!reservation) {
      throw new NotFoundException('Reservation not found or not owned by user');
    }

    return this.reservationModel.findByIdAndDelete(id).exec();
  }

  removeAll() {
    return this.reservationModel.deleteMany().exec();
  }
}
