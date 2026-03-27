import axios from 'axios';
//  graphql 패키지에서 AST를 문자열로 변환해주는 print 함수 임포트
import { print, DocumentNode } from 'graphql';

// 1. 설정 및 토큰 Getter 타입 정의
type TokenGetter = () => string | null | undefined;

// 초기화 시 전달받을 설정 객체 타입
interface HttpConfig {
  tokenGetter: TokenGetter;
  apiBaseUrl?: string; // 예: http://localhost:4000
  gqlPath?: string; // 예: /graphql
}

// 2. 모듈 스코프 변수 (초기값 설정)
let getToken: TokenGetter = () => null;
let currentGqlPath = '/graphql'; // 기본값

// axios 인스턴스 생성 (BaseURL은 initHttp에서 설정됨)
export const http = axios.create({ timeout: 15000 });

// 3. [초기화 함수] 앱(FE) 진입점에서 호출하여 환경변수와 토큰 로직 주입
export const initHttp = (config: HttpConfig) => {
  // 토큰 로직 주입
  getToken = config.tokenGetter;

  // API Base URL 주입 (존재할 경우)
  if (config.apiBaseUrl) {
    http.defaults.baseURL = config.apiBaseUrl;
  }

  // GraphQL 경로 주입 (존재할 경우)
  if (config.gqlPath) {
    currentGqlPath = config.gqlPath;
  }
};

// 4. 요청 인터셉터: 주입받은 getToken() 함수를 실행해 토큰 획득
http.interceptors.request.use((config) => {
  const token = getToken();

  /**
   * Authorization 헤더를 확실하게 주입합니다.
   * 토큰이 존재할 경우 Bearer 규격에 맞춰 헤더를 설정
   */
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

/**
 * GraphQL 요청 헬퍼
 *  query 매개변수가 문자열뿐만 아니라 Codegen이 만든 객체(DocumentNode)도 받을 수 있게 타입 확장
 */
export async function gql<T>(
  query: string | DocumentNode | any,
  variables?: Record<string, any>,
): Promise<T> {
  // initHttp를 통해 주입된 경로 사용
  const path = currentGqlPath;

  //query가 AST 객체(DocumentNode)라면 print()를 통해 백엔드가 읽을 수 있는 순수 문자열로 변환
  const queryString = typeof query === 'string' ? query : print(query);

  const res = await http.post(
    path,
    { query: queryString, variables }, // 변환된 문자열 전송
    { headers: { 'content-type': 'application/json' } },
  );

  const body = res.data;

  if (body?.errors?.length) {
    const firstErr = body.errors[0];
    const msg = firstErr?.message ?? 'GraphQL Error';
    console.error('[GQL Error]', body.errors);
    throw new Error(msg);
  }

  return body.data as T;
}
