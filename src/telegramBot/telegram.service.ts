import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context ,Keyboard } from 'grammy';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Bot<Context>;

  onModuleInit() {
    this.bot = new Bot<Context>('7362217317:AAHNYMrTZEIlMiSYtQ9xOb2B5LuakAWI-QA');

    // Реакція на команду /start
    this.bot.command("start", (ctx) => {
      const keyboard = new Keyboard()
        .text("Кнопка 1")
        .text("Кнопка 2")
        .row()
        .text("Кнопка 3")
        .resized()
        .persistent();
    
      ctx.reply("Ласкаво просимо! Оберіть одну з опцій:", {
        reply_markup: keyboard
      });
    });
    this.bot.callbackQuery("button1", (ctx) => {
      ctx.answerCallbackQuery("Ви натиснули Кнопку 1!");
      // Додаткова логіка для Кнопки 1
    });
    
    this.bot.callbackQuery("button2", (ctx) => {
      ctx.answerCallbackQuery("Ви натиснули Кнопку 2!");
      // Додаткова логіка для Кнопки 2
    });
    
    this.bot.callbackQuery("button3", (ctx) => {
      ctx.answerCallbackQuery("Ви натиснули Кнопку 3!");
      // Додаткова логіка для Кнопки 3
    });

    // Реакція на команду /help
    this.bot.command('help', (ctx) => {
      ctx.reply('You can control me by sending these commands:\n/start - to start the bot\n/help - to get this help message');
    });

    // Реакція на текстові повідомлення
    this.bot.on('message:text', (ctx) => {
      ctx.reply(`You said: ${ctx.message.text}`);
    });

    // Реакція на всі стікери
    this.bot.on('msg:sticker', (ctx) => {
      ctx.reply('Nice sticker!');
    });
    
    // Запуск бота
    this.bot.start();
  }

  getBot() {
    return this.bot;
  }
}