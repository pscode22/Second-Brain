import { useLayoutEffect, useState } from 'react';
import { ReadUserConfig } from '../services/storage';

export const useUserName = () => {
  const [userName, setUserName] = useState<string>('');

  useLayoutEffect(() => {
    const setName = async () => {
      const user = await ReadUserConfig();
      setUserName(user?.userName || 'No UserName');
    };
    setName();
  }, []);

  return userName;
};
