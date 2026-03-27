import { getStorageItem, removeStorageItem, setStorageItem } from './localStorage';

export function getJsonStorageItem<T>(key: string): T | null {
  const raw = getStorageItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setJsonStorageItem<T>(key: string, value: T): void {
  setStorageItem(key, JSON.stringify(value));
}

export function removeJsonStorageItem(key: string): void {
  removeStorageItem(key);
}
