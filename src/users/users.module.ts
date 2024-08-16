import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { USER_SERVICE_TOKEN } from './constant/user.constant';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
