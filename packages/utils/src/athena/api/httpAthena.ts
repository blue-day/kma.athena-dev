import axios from 'axios';
import { keysToCamelCase } from '../comn/comnUtil';

export type WithCode = {
  code: number;
};
/** @description 공통 성공 코드 타입가드 */
export function isCode<T extends WithCode, C extends number>(
  res: T,
  code: C,
): res is Extract<T, { code: C }> {
  return res.code === code;
}

type TokenGetter = () => string | null | undefined;
type RefreshHandler = () => Promise<string | null>;

interface HttpConfig {
  tokenGetter: TokenGetter;
  refreshHandler?: RefreshHandler;
  apiBaseUrl?: string; // ex) https://kma-athena.dev.uracle.co.kr
  gqlPath?: string; // ex) /graphql
}

let getToken: TokenGetter = () => null;
let refreshHandler: RefreshHandler | undefined;
// let refreshPromise: Promise<string | null> | null = null;

export const httpAthena = axios.create({
  timeout: 15000,
  headers: { 'content-type': 'application/json' },
});

export const initHttpAthena = (config: HttpConfig) => {
  getToken = config.tokenGetter;
  refreshHandler = config.refreshHandler;
  if (config.apiBaseUrl) {
    httpAthena.defaults.baseURL = config.apiBaseUrl;
  }
};

httpAthena.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpAthena.interceptors.response.use(
  (res) => {
    res = keysToCamelCase(res);
    return res;
  },
  (err) => Promise.reject(err),
);

// Athena api 호출 (POST)
export async function httpSendAthena<T>(path: string, body?: Record<string, any>): Promise<T> {
  const { data } = await httpAthena.post(path, body);
  if (!isCode(data, 200)) {
    throw new Error('Athena API Error' + data);
  }
  return data.data as T;
}

export async function httpSendAthenaWithOptions<T>(path: string, body?: Record<string, any>): Promise<T> {
  const { data } = await httpAthena.post(path, body, {
    headers: {
      ...{ 'x-no-auth': 'true' },
    },
  });
  if (!isCode(data, 200)) {
    throw new Error('Athena API Error' + data);
  }
  return data.data as T;
}
