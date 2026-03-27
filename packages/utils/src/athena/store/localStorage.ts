const isBrowser = () => typeof window !== 'undefined';

export function getStorageItem(key: string): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

export function clearStorageByPrefix(prefix: string): void {
  if (!isBrowser()) return;

  const keys = Object.keys(window.localStorage);
  keys.forEach((key) => {
    if (key.startsWith(prefix)) {
      window.localStorage.removeItem(key);
    }
  });
}
