require('dotenv').config();
import { setUpServer } from './server';
import { setUpDatabase } from './database';
import { setUpBot } from './bot';
import { setUpNotificationsCron } from './cron';

// Server is needed for Heroku
setUpServer();
setUpDatabase(() => {
  setUpBot();
  setUpNotificationsCron();
});