import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  hashed_refresh_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
