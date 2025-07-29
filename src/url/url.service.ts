import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schema/url.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name)
    private readonly urlModel: Model<UrlDocument>,
  ) {}

  async shorten(originalUrl: string, userId: number) {
    const shortCode = uuidv4().slice(0, 6);

    const url = new this.urlModel({
      originalUrl,
      shortCode,
      userId,
      createdAt: new Date(),
      visits: 0,
    });

    await url.save();

    return {
      shortCode,
      shortUrl: `http://localhost:3030/url/${shortCode}`,
    };
  }

  async redirect(shortCode: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('Short code topilmadi');

    url.visits += 1;
    await url.save();

    return url.originalUrl;
  }

  async getStats(shortCode: string, userId: number) {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('Short code topilmadi');
    if (url.userId !== userId)
      throw new ForbiddenException('Bu statistikaga siz kira olmaysiz');

    return {
      originalUrl: url.originalUrl,
      visits: url.visits,
      createdAt: url.createdAt,
    };
  }
}
