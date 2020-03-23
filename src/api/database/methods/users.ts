import { User } from '../';

export const getUsers = (): Promise<User[]> => {
  return User.find()
    .catch((error) => {
      console.log('Error on getting users:', error.message);
      return null;
    });
};