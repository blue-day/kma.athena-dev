/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#E2E3E7',
          100: '#C6C8CF',
          200: '#A8ABB6',
          300: '#7f8394',
          400: '#626777',
          500: '#4E525F',
          600: '#3D4049',
        },
      },
    },
  },
  plugins: [],
};
