import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCoworkingspaceDto } from './dto/create-coworkingspace.dto';
import { UpdateCoworkingspaceDto } from './dto/update-coworkingspace.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { Reservation } from 'src/reservation/schema/reservation.schema';
import {
  Coworkingspace,
  CoworkingspaceDocument,
  CoworkingspaceSchema,
} from './schemas/coworkingspace.schema';
import { ReservationDocument } from 'src/reservation/schema/reservation.schema';
import { Model } from 'mongoose';
@Injectable()
export class CoworkingspaceService {
  constructor(
    @InjectModel(Coworkingspace.name)
    private coworkingspaceModel: Model<CoworkingspaceDocument>,
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async create(
    createCoworkingspaceDto: CreateCoworkingspaceDto,
  ): Promise<Coworkingspace> {
    const newCoworkingspace = new this.coworkingspaceModel(
      createCoworkingspaceDto,
    );

    return newCoworkingspace.save();
  }

  async findAll(
    filter: {
      address?: string;
      date?: Date;
      startTime?: Date;
      endTime?: Date;
    } = {},
    role: string,
  ) {
    if (role === Role.ADMIN) {
      // For admin, return all coworking spaces without filtering
      return this.coworkingspaceModel.find().exec();
    }

    if (role === Role.USER) {
      console.log('date', filter.date);
      console.log('startTime', filter.startTime);
      console.log('endTime', filter.endTime);
      // Fetch all coworking spaces
      const allCoworkingSpaces = await this.coworkingspaceModel.find().exec();

      // Use Promise.all with map to process all coworking spaces asynchronously
      const availableCoworkingSpaces = await Promise.all(
        allCoworkingSpaces.map(async (cws) => {
          // Create a query for overlapping reservations
          const overlappingReservations = await this.reservationModel.find({
            coworkingspaceId: cws._id,
            status: 'reserved',
            date: filter.date,
            $or: [
              {
                startTime: { $lt: filter.endTime },
                endTime: { $gt: filter.startTime },
              },
            ],
          });

          console.log('Overlapping reservations:', overlappingReservations);

          // Check if there are fewer overlapping reservations than the available rooms
          if (overlappingReservations.length < cws.num_rooms) {
            // Check filters and ensure the coworking space matches the requested criteria
            console.log(cws._id);
            return cws; // Return coworking space if conditions are met
          }
          return null; // Return null if the coworking space doesn't match the conditions
        }),
      );

      // Filter out null results from the array
      return availableCoworkingSpaces.filter((cws) => cws !== null);
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} coworkingspace`;
  }

  async update(id: string, updateCoworkingspaceDto: UpdateCoworkingspaceDto) {
    const updated = await this.coworkingspaceModel.findByIdAndUpdate(
      id,
      updateCoworkingspaceDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Coworking space with ID ${id} not found`);
    }

    return updated;
  }

  remove(id: string) {
    return this.coworkingspaceModel.deleteOne({ _id: id }).exec();
  }
}
