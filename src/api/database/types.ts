export interface TelegramUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

export interface GitHubUserData {
  username?: string;
  token?: string;
}