import EncryptedStorage from 'react-native-encrypted-storage';

export const setCache = async (key: string, value: any) => {
  const data = { value, timestamp: Date.now() };
  await EncryptedStorage.setItem(key, JSON.stringify(data));
};

export const getCache = async (key: string, maxAgeMs: number) => {
  const cached = await EncryptedStorage.getItem(key);
  if (!cached) return null;
  const parsed = JSON.parse(cached);
  if (Date.now() - parsed.timestamp > maxAgeMs) return null;
  return parsed.value;
};
