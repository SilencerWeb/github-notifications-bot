import mongoose, { Document, Schema } from 'mongoose';
import { TelegramUserData, GitHubUserData } from '../types';

export interface User extends Document {
  telegram: TelegramUserData;
  github?: GitHubUserData;
  lastTimeChecked?: Date;
}

const userSchema: Schema = new Schema({
  telegram: {
    id: { type: Number, required: true, unique: true },
    firstName: String,
    lastName: String,
    username: String,
    languageCode: String,
  },
  github: {
    username: String,
    token: String,
  },
  lastTimeChecked: Date,
});

export const User = mongoose.model<User>('User', userSchema);
