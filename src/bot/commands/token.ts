import { bot } from '../bot';
import { updateUser, User } from '../../api';
import { getTelegramUserData } from '../utils';

export const setUpTokenCommand = () => {
  bot.hears(/\/token (.+)/, async (context) => {
    const telegramUserData = getTelegramUserData(context);
    const token: string | undefined = context.match[1];
    if (!token) return;

    return updateUser(telegramUserData.id, { github: { token } } as User);
  });
};