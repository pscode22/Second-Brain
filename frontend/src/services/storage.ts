import localforage from 'localforage';
import { TokenConfig } from '../interfaces/generic';

const StorageKeys = {
  token: 'token',
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
