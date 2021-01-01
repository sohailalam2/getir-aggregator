import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Records, RecordsSchema } from './schema';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // configure mongoose connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // import mongoose schemas as module
    MongooseModule.forFeature([{ name: Records.name, schema: RecordsSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
