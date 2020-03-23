import { setUpCommands } from './commands';
import { launchBot } from './launch-bot';

export const setUpBot = () => {
  setUpCommands();
  launchBot();
};