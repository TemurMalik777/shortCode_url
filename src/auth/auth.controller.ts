import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('user/signIn')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kiritish (login)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli login' })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri' })
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.signIn(loginDto, res);
  }

  @Post('user/signOut')
  @ApiOperation({ summary: 'Foydalanuvchini tizimdan chiqarish (logout)' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqdi' })
  signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req as any, res);
  }

  @Get('user')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar ro‘yxati' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro‘yxati' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini ko‘rish' })
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
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateUserDto) {
    return this.userService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi o‘chirildi' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
