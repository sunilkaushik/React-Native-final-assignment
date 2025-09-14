import EncryptedStorage from "react-native-encrypted-storage";

const TOKEN_KEY = "secure_auth_token";

export async function saveToken(token: string): Promise<void> {
  await EncryptedStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  const t = await EncryptedStorage.getItem(TOKEN_KEY);
  return t ?? null;
}

export async function removeToken(): Promise<void> {
  await EncryptedStorage.removeItem(TOKEN_KEY);
}
