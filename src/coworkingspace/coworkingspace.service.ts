import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCoworkingspaceDto } from './dto/create-coworkingspace.dto';
import { UpdateCoworkingspaceDto } from './dto/update-coworkingspace.dto';
import {
  Coworkingspace,
  CoworkingspaceDocument,
  CoworkingspaceSchema,
} from './schemas/coworkingspace.schema';
import { Model } from 'mongoose';
@Injectable()
export class CoworkingspaceService {
  constructor(
    @InjectModel(Coworkingspace.name)
    private coworkingspaceModel: Model<CoworkingspaceDocument>,
  ) {}

  async create(
    createCoworkingspaceDto: CreateCoworkingspaceDto,
  ): Promise<Coworkingspace> {
    const newCoworkingspace = new this.coworkingspaceModel(
      createCoworkingspaceDto,
    );
    return newCoworkingspace.save();
  }

  findAll() {
    return this.coworkingspaceModel.find().exec();
  }

  findAllAvailable(
    filter: {
      address?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
    } = {},
  ) {
    console.log(filter);
    const query: any = {
      $expr: { $ne: ['$num_booked', '$num_rooms'] }, // Ensure availability
    };

    if (filter.address) {
      query.address = { $regex: filter.address, $options: 'i' }; // Case insensitive search
    }
    if (filter.date) {
      const date = new Date(filter.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (filter.startTime) {
      const startTime = new Date(filter.startTime);
      query.startTime = { $gte: startTime };
    }
    if (filter.endTime) {
      const endTime = new Date(filter.endTime);
      query.endTime = { $lte: endTime };
    }

    console.log(query);

    return this.coworkingspaceModel.find(query).exec();
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
