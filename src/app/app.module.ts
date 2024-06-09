import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from '../telegramBot/telegram.module';


@Module({
  imports: [
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}