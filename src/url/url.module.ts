// src/url/url.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url, UrlSchema } from './schema/url.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
