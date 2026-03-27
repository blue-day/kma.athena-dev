export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

// api response key 명칭 camelCase 방식으로 전환
export function keysToCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamelCase(v)) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    Object.keys(obj).forEach((key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = keysToCamelCase(obj[key]);
    });

    return result as T;
  }

  return obj;
}
