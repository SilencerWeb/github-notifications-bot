import deepMerge from 'merge-deep';
import { User } from '../';
import { TelegramUserData } from '../';

export const createUser = async (telegramUserData: TelegramUserData): Promise<User> => {
  const telegramId = telegramUserData.id;

  const doesUserExist = await User.exists({ 'telegram.id': telegramId });
  if (doesUserExist) console.log(`User with telegram.id ${telegramId} already exists`);

  const user = { telegram: telegramUserData };
  return User.create(user)
    .catch((error) => {
      console.log('Error on saving a user:', error.message);
      return null;
    });
};

export const getUser = (telegramId: number): Promise<User> => {
  return User.findOne({ 'telegram.id': telegramId })
    .catch((error) => {
      console.log('Error on getting a user:', error.message);
      return null;
    });
  ;
};

export const updateUser = async (telegramId: number, updatingFields: {}): Promise<User> => {
  const user = await getUser(telegramId);
  const updatedUser = deepMerge(user, updatingFields);

  const options = { new: true };
  return User.findOneAndUpdate({ 'telegram.id': telegramId }, updatedUser, options)
    .catch((error) => {
      console.log('Error on updating a user:', error.message);
      return null;
    });
};