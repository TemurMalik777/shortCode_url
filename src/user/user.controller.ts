import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi yaratildi' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro‘yxati' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi topildi' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi yangilandi' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi o‘chirildi' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
