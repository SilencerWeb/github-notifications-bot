import { ContextMessageUpdate } from 'telegraf';
import { TelegramUserData } from '../../api';

export const getTelegramUserData = (context: ContextMessageUpdate): TelegramUserData => {
  const user = context.update.message.from;

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    languageCode: user.language_code,
  } as TelegramUserData;
};
