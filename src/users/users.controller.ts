import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SERVICE_TOKEN } from './constant/user.constant';
import { UserServiceInterface } from './interface/user.service.interface';
import * as Bcrypt from 'bcrypt';
import { userDocument } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { loginUserDto } from './dto/login-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller({
  path: 'user',
  version: '1',
})
export class UsersController {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly usersService: UserServiceInterface,
  ) {}

  @Post()
  async create(@Body() payload: CreateUserDto) {
    const data = { ...payload };
    data.password = await Bcrypt.hash(data.password, 10);
    return plainToInstance(
      userDocument,
      await this.usersService.createUser(data),
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      },
    );
  }

  @Get()
  async findAll(
    @Query('page') page,
    @Query('pageSize') pageSize,
    @Query('search') search,
  ) {
    const getUsers = await this.usersService.getAllUser({
      page,
      pageSize,
      search,
    });
    const sanitizedData = getUsers.data.map((user) =>
      plainToInstance(userDocument, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    );

    return { data: sanitizedData, total: getUsers.total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    const data = { ...payload };
    if (!!data.password) {
      data.password = await Bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('auth')
  authenticateUser(@Body() payload: loginUserDto) {
    const validUser = this.usersService.validateUser(payload);
    return (
      validUser &&
      plainToInstance(userDocument, validUser, {
        enableImplicitConversion: true,
      })
    );
  }
}
