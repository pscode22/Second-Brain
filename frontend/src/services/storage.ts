import localforage from 'localforage';
import { TokenConfig } from '../interfaces/generic';

const StorageKeys = {
  token: 'token',
  user: 'user',
};

export const ClearAllConfigs = async () => {
  await localforage.clear();
  return;
};

export const ReadTokenConfig = async () => {
  const token = await localforage.getItem<TokenConfig>(StorageKeys.token);
  return token || null;
};

export const WriteTokenConfig = async (token: TokenConfig) => {
  await localforage.setItem<TokenConfig>(StorageKeys.token, token);
  return;
};

export const ReadUserConfig = async () => {
  const user = await localforage.getItem<{ userName: string }>(StorageKeys.user);
  return user || null;
};

export const WriteUserConfig = async ({ userName }: { userName: string }) => {
  await localforage.setItem<{ userName: string }>(StorageKeys.user, { userName });
  return;
};
