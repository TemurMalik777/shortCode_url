import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    MongooseModule.forRoot(String(process.env.MONGO_URL)),
    AuthModule,
    UserModule,
    UrlModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
