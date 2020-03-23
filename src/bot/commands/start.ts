import { createUser } from '../../api';
import { bot } from '../bot';
import { getTelegramUserData } from '../utils';

export const setUpStartCommand = () => {
  bot.start((context) => {
    const telegramUserData = getTelegramUserData(context);
    return createUser(telegramUserData);
  });
};