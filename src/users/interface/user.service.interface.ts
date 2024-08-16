import { UpdateWriteOpResult } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { loginUserDto } from '../dto/login-user.dto';

export interface UserServiceInterface {
  createUser(payload: CreateUserDto): Promise<User>;
  getAllUser({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<{ data: User[]; total: number }>;
  updateUser(id: string, payload: UpdateUserDto): Promise<UpdateWriteOpResult>;
  deleteUser(id: string): Promise<UpdateWriteOpResult>;
  getUserById(Id: string): Promise<User>;
  validateUser(payload: loginUserDto);
}
