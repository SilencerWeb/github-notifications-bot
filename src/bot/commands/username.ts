import { bot } from '../bot';
import { updateUser, User } from '../../api';
import { getTelegramUserData } from '../utils';

export const setUpUsernameCommand = () => {
  bot.hears(/\/username (.+)/, async (context) => {
    const telegramUserData = getTelegramUserData(context);
    const username: string | undefined = context.match[1];
    if (!username) return;

    return updateUser(telegramUserData.id, { github: { username } } as User);
  });
};