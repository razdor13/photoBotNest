import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from '../telegramBot/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TelegramModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}