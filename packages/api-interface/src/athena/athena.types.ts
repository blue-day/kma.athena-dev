/** @description Athena 통신 Type */
export type AthenaResponse<T> = AthenaSuccess<T> | AthenaFailData;

/** @description Athena 통신 성공 */
export type AthenaSuccess<T> = {
  code: 200;
  data: T;
  notiInfo?: unknown | null;
};
/** @description Athena 통신 실패 */
export type AthenaFailData = {
  code: Exclude<number, 200>;
  message?: string | null;
};

/** @description Athena 직접 토큰 발급 요청 */
export type AthenaDirectTokenRequest = {
  email: string;
  password: string;
};

/** @description Athena 토큰 발급 응답 */
export type AthenaTokenData = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiresAtKst: string;
  passwordStatus?: {
    code: string;
    message: string;
  };
  type?: string;
};

/** @description Athena 챗봇 요청 */
export type AthenaChatRequest = {
  outputType: 'chat';
  inputType: 'chat';
  inputValue: string;
};

/** @description Athena 챗봇 응답 */
export type AthenaChatResponse = AthenaResponse<AthenaChatData>;

export type AthenaChatData = {
  sessionId: string;
  outputs: AthenaChatOutput[];
};

export type AthenaChatOutput = {
  inputs: {
    inputValue: string;
  };
  outputs: [{ results: { message: AthenaTitleMessage } }];
};

export type AthenaTitleMessage = {
  textKey: string;
  data: object;
  text: string;
  sender: string;
  sessionId: string;
  timestamp: string;
};

export type AthenaChatMessage = {
  text: string;
  timestamp: string;
  sender: string;
  files: [];
};
