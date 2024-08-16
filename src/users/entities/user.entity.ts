import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true, unique: true })
  mobileNumber: string;

  @Prop({ isRequired: true })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);

export class userDocument {
  @Expose()
  @Transform((param) => param.obj._id.toString())
  id: string;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  mobileNumber: string;

  @Exclude()
  password?: string; // encrypted password

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
