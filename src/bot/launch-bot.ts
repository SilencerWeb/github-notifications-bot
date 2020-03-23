import { bot } from './bot';

export const launchBot = () => {
  bot.launch()
    .then(() => console.log('Bot is up and running!'))
    .catch((error) => console.log('Error on starting the bot:', error.message));
};