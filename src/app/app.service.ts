import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
