import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.scchema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userSchema: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userSchema.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Bunday email allaqachon mavjud');
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    return this.userSchema.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.userSchema.find();
  }

  async findOne(id: string) {
    return this.userSchema.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userSchema.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: string) {
    return this.userSchema.findByIdAndDelete(id);
  }

  async findByEmail(email: string) {
  return this.userSchema.findOne({ email });
}
}
