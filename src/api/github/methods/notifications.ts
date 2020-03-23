import { api } from './api';

export const getNotifications = async ({ username, token, since }) => {
  return api.get(
    '/notifications',
    {
      auth: {
        username: username,
        password: token,
      },
      params: {
        since,
      },
    },
  )
    .then((response) => response.data)
    .catch((error) => {
      console.log('Error on getting notifications:', error.message);
      return null;
    });
};