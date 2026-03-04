/* eslint-env node */

module.exports = {
  root: true, // 상위 설정 간섭 차단
  parser: '@typescript-eslint/parser', // [필수] TS 파서 지정
  plugins: ['@typescript-eslint'], // [필수] TS 플러그인 로드
  extends: [
    'next/core-web-vitals', // Next.js 필수 룰
    'plugin:@typescript-eslint/recommended', // TS 권장 룰 (여기서 no-unused-vars 정의됨)
    'prettier', // Prettier 충돌 방지
  ],
  rules: {
    // 사용하지 않는 변수는 경고로 처리 (에러 방지)
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',

    // Next.js Image 컴포넌트 사용 강제 끄기 (선택 사항)
    '@next/next/no-img-element': 'off',
  },
};
