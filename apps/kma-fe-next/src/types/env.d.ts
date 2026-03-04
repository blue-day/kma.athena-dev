declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE: string;
    NEXT_PUBLIC_GQL_PATH: string;
    NEXT_PUBLIC_APP_LANG_DEFAULT: string;
    NEXT_PUBLIC_API_MODE: 'mock' | 'real';
  }
}
