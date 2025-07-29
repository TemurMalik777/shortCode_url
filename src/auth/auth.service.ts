// auth.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../user/schema/user.scchema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async generateTokens(user: UserDocument) {
    const payload = { id: user._id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signIn(dto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateTokens(user);
    user.hashed_refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_TIME),
    });

    res.json({
      message: 'Login successful',
      accessToken,
    });
  }

  async signOut(req: Request & { cookies: any; user?: any }, res: Response) {
  const refreshToken = req.cookies['refreshToken'];
  const userId = req.user?.id;

  if (!refreshToken || !userId) {
    throw new UnauthorizedException('Token yoki user aniqlanmadi');
  }

  await this.userModel.updateOne({ _id: userId }, {
    hashed_refresh_token: null,
  });

  res.clearCookie('refreshToken');
  return { message: 'Signed out successfully' };
}

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.hashed_refresh_token)
      throw new NotFoundException('User not found or token missing');

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokenMatch) throw new ForbiddenException('Invalid refresh token');

    const tokens = await this.generateTokens(user);
    user.hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_TIME),
    });

    return {
      message: 'Token refreshed',
      accessToken: tokens.accessToken,
    };
  }
}
