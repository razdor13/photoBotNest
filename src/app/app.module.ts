import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from '../telegramBot/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
