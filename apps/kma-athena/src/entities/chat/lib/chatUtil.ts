// 챗봇 session Id 생성 함수
const SESSION_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateSessionId(length = 16): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += SESSION_ID_CHARS[array[i] % SESSION_ID_CHARS.length];
  }
  return result;
}
