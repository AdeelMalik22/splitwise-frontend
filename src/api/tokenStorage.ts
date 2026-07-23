import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_KEY = "splitwise_access_token";
const REFRESH_KEY = "splitwise_refresh_token";

// expo-secure-store is not supported on web — fall back to localStorage.
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const tokenStorage = {
  async getAccessToken() {
    return storage.getItem(ACCESS_KEY);
  },
  async getRefreshToken() {
    return storage.getItem(REFRESH_KEY);
  },
  async setTokens(access: string, refresh: string) {
    await storage.setItem(ACCESS_KEY, access);
    await storage.setItem(REFRESH_KEY, refresh);
  },
  async setAccessToken(access: string) {
    await storage.setItem(ACCESS_KEY, access);
  },
  async clear() {
    await storage.removeItem(ACCESS_KEY);
    await storage.removeItem(REFRESH_KEY);
  },
};
