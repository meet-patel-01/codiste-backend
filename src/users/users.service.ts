import * as Bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { loginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    return (await this.userModel.create(payload)).toObject();
  }

  async getAllUser({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<{ data: User[]; total: number }> {
    const skip = page * pageSize;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const data = await this.userModel
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const total = await this.userModel.countDocuments(query);

    return { data, total };
  }

  updateUser(id: string, payload: UpdateUserDto): Promise<UpdateWriteOpResult> {
    return this.userModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .lean();
  }

  deleteUser(id: string): Promise<UpdateWriteOpResult> {
    return this.userModel.deleteOne({ _id: id }).lean();
  }

  getUserById(Id: string): Promise<User> {
    return this.userModel.findById(Id).lean();
  }

  async validateUser(payload: loginUserDto) {
    const isUserExist = await this.userModel
      .findOne({
        email: { $regex: payload.email, $options: 'i' },
      })
      .exec();

    if (!isUserExist) return new NotFoundException('user not found');

    const user = isUserExist.toObject();
    const validatePassword = Bcrypt.compareSync(
      payload.password,
      user.password,
    );

    if (!validatePassword) return new NotFoundException('incorrect password');

    return user;
  }
}
