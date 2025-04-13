import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const newUser = new this.userModel(registerDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // async findOne(id: string): Promise<User> {
  //   return this.userModel.findById(id).exec();
  // }

  // async remove(id: string): Promise<User> {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }
  remove(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
