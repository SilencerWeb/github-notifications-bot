import { setUpStartCommand } from './start';
import { setUpTokenCommand } from './token';
import { setUpUsernameCommand } from './username';

export const setUpCommands = () => {
  setUpStartCommand();
  setUpTokenCommand();
  setUpUsernameCommand();
};