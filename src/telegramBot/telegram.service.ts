import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context, Keyboard, InlineKeyboard } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { cityLocations, photoSessions, studioLocations } from '../photoSessions';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Bot<Context>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const telegramToken = this.configService.get<string>('API_TG_KEY');
    this.bot = new Bot<Context>(telegramToken);

    this.bot.command('start', this.handleStart);
    this.bot.on('message', this.handleMessage);
    this.bot.callbackQuery(/choose_location:(\d+)/, this.handleChooseLocation);
    this.bot.callbackQuery(/location:(.*)/, this.handleLocation);

    this.bot.start();
  }

  private async handleStart(ctx: Context) {
    const keyboard = new Keyboard();
    for (const session of photoSessions) {
      keyboard.text(session.name).row();
    }
    keyboard.resized();

    await ctx.reply(
      'Вас вітає інформаційний бот 📸, який допоможе розібратись, що ж таке фотосесія, скільки вона коштує 💸 і як до неї підготуватись ✨.\n\n' +
      'Наша мета - зробити ваш досвід яскравим, а ваші фото незабутніми! 🌟\n\n' +
      'Оберіть тип фотосесії нижче, щоб дізнатися більше! 😊',
      { reply_markup: keyboard },
    );
  }

  private async handleMessage(ctx: Context) {
    const sessionName = ctx.message?.text;
    const session = photoSessions.find(session => session.name === sessionName);
    if (!session) return;

    const media = session.images.map((image, index) => ({
      type: 'photo',
      media: image,
      caption: index === 0 ? session.descr : undefined,
      parse_mode: 'Markdown',
    }));

    await ctx.replyWithMediaGroup(media as any);

    const inlineKeyboard = new InlineKeyboard()
      .text('🌍 Обрати локацію по місту', 'choose_location:1')
      .text('🏘 Обрати студію', 'choose_location:2');

    await ctx.reply('Бажаєте обрати локацію для вашої фотосесії по місту або в студії?🌍🏘', {
      reply_markup: inlineKeyboard,
    });
  }

  private async handleChooseLocation(ctx: Context) {
    const locationType = ctx.match?.[1];
    const locations = locationType === '1' ? cityLocations : studioLocations;

    const locationKeyboard = new InlineKeyboard();
    if (locationType === '1') {
      locations.forEach(location => {
        locationKeyboard.text(location.name, `location:${location.name}`).row();
      });
    } else {
      locations.forEach(location => {
        locationKeyboard.url(location.name, location.url).row();
      });
    }

    await ctx.reply('Оберіть локацію:', { reply_markup: locationKeyboard });
  }

  private async handleLocation(ctx: Context) {
    const locationName = ctx.match?.[1];
    const location = [...cityLocations, ...studioLocations].find(loc => loc.name === locationName);
    if (!location) return;

    if (location.photo) {
      await ctx.replyWithPhoto(location.photo, {
        caption: location.name,
        parse_mode: 'Markdown',
      });
    }

    if (location.latitude && location.longitude) {
      await ctx.replyWithLocation(location.latitude, location.longitude);
    }

    const inlineKeyboard = new InlineKeyboard()
      .text('🌍 Обрати локацію по місту', 'choose_location:1')
      .text('🏘 Обрати студію', 'choose_location:2');

    await ctx.reply('Оберіть наступну локацію, що вас цікавить:', {
      reply_markup: inlineKeyboard,
    });
  }

  getBot() {
    return this.bot;
  }
}