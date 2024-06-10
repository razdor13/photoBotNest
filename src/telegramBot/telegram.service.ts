import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context, Keyboard, InlineKeyboard } from 'grammy';
import { photoSessions } from '../photoSessions';
import { ConfigService } from '@nestjs/config'; 
@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Bot<Context>;

  constructor(private configService : ConfigService) {}
  onModuleInit() {
    const telegramToken = this.configService.get<string>('API_TG_KEY');
    console.log(telegramToken)
    this.bot = new Bot<Context>(
      telegramToken
    );
    
    this.bot.command('start', async (ctx) => {
      const keyboard = new Keyboard();
      for (const session of photoSessions) {
        keyboard.text(session.name).row().resized();
      }

      await ctx.reply(
        'Вас вітає інформаційний бот 📸, який допоможе розібратись, що ж таке фотосесія, скільки вона коштує 💸 і як до неї підготуватись ✨.\n\n' +
          'Наша мета - зробити ваш досвід яскравим, а ваші фото незабутніми! 🌟\n\n' +
          'Оберіть тип фотосесії нижче, щоб дізнатися більше! 😊',
        {
          reply_markup: keyboard,
        },
      );
    });

    this.bot.on('message', async (ctx) => {
      const sessionName = ctx.message.text;
      const session = photoSessions.find(
        (session) => session.name === sessionName,
      );
      if (!session) {
        return;
      }

      const media = session.images.map((image, index) => ({
        type: 'photo',
        media: image,
        caption: index === 0 ? `${session.descr}` : undefined,
        parse_mode: 'Markdown',
      }));

      await ctx.replyWithMediaGroup(media as any);
      const inlineKeyboard = new InlineKeyboard()
        .text('🌍 Обрати локацію по місту', `choose_location:1`)
        .text('🏘 Обрати студію', `choose_location:2`);

      await ctx.reply(
        'Бажаєте обрати локацію для вашої фотосесії по місту або в студії?🌍🏘',
        {
          reply_markup: inlineKeyboard,
        },
      );
    });
    this.bot.callbackQuery(/choose_location:(\d+)/, async (ctx) => {
      const locationType = ctx.match[1];

      let locations: any;
      if (locationType === '1') {
        locations = ['Ботанічний сад ЛНУ', 'Стрийський парк', 'Будинок Вчених'];
      } else if (locationType === '2') {
        locations = [
          { name: 'photostudio.81', url: 'https://www.instagram.com/photostudio.81?igsh=cXVqam04bnYydTl6' },
          { name: 'passage_studios', url: 'https://www.instagram.com/passage_studios?igsh=MWRpczBxZXNpYzM1eQ==' },
          { name: 'luno_studio_', url: 'https://www.instagram.com/luno_studio_?igsh=MTNpNHJ1bTMxNWIxNA==' },
          { name: 'esthetique_lviv', url: 'https://www.instagram.com/esthetique_lviv?igsh=MTczZDR4OTZyY3RzMA==' },
          { name: 'Red Pine', url: 'https://www.instagram.com/redpine_photostudio?igsh=cjB5amdhdnBhaDhp' }
        ];
      }

      const locationKeyboard = new InlineKeyboard();
      locations.forEach((location) => {
        if(locationType === '1') {
          locationKeyboard.text(location, `location:${location}`).row();
        }else if (locationType === '2') {
          locationKeyboard.url(location.name,location.url).row();
        }
      });

      await ctx.reply('Оберіть локацію:', { reply_markup: locationKeyboard });
    });
    this.bot.callbackQuery(/location:(.*)/, async (ctx) => {
      const locationName = ctx.match[1];
      console.log(locationName);
      switch (locationName) {
        case 'Ботанічний сад ЛНУ':
          await ctx.replyWithPhoto('https://tvoemisto.tv/media/gallery/full/5/other/5_35f1c_c558d.jpg', {
            caption: 'Ботанічний сад Львівського національного університету імені Івана Франка',
            parse_mode: 'Markdown',
          });
          await ctx.replyWithLocation(49.83270528787713, 24.031263115091303); 
          
          break;
        case 'Стрийський парк':
          await ctx.replyWithPhoto('https://ua.igotoworld.com/frontend/webcontent/websites/1/images/gallery/8391_800x600_Park_Stryjski(1).jpg', {
            caption: 'Стрийський парк',
            parse_mode: 'Markdown',
          });
          await ctx.replyWithLocation(49.8230219, 24.024981); 
          break;
        case 'Будинок Вчених':
          await ctx.replyWithPhoto('https://inside-ua.com/files/originals/budinok-vchenih-3.webp', {
            caption: 'Будинок Вчених за адресою вулиця Листопадового Чину, 6',
            parse_mode: 'Markdown',
          });
          await ctx.replyWithLocation(49.8410923, 24.02141);
          break;

        default:
          break;
      }
      const inlineKeyboard = new InlineKeyboard()
        .text('🌍 Обрати локацію по місту', `choose_location:1`)
        .text('🏘 Обрати студію', `choose_location:2`);

      await ctx.reply('Оберіть наступну локацію що вас цікавить:', {
        reply_markup: inlineKeyboard,
      });
      
      
    });
    this.bot.start();
  }

  getBot() {
    return this.bot;
  }
}
