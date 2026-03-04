/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}', // UI 패키지 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
