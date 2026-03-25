/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
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
