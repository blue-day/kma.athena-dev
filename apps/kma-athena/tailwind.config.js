/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 1. kma-athena 앱 내의 모든 FSD 레이어 폴더 스캔
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',

    // 2. 모노레포 내 공통 UI 패키지
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--kma-primary)',
        gray: {
          300: 'var(--kma-gray-300)',
          400: 'var(--kma-gray-400)',
          border: 'var(--kma-gray-border)',
        },
      },
    },
  },
  plugins: [],
};
