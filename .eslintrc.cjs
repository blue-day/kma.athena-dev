/* eslint-env node */

module.exports = {
  root: true,
  env: { es2021: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
  },
  overrides: [
    // (A) Vite Apps & Packages (Next.js 제외)
    {
      files: [
        // 'apps/kma-fe/**/*.{ts,tsx}',
        'apps/kma-fe/**/*.{ts,tsx}',
        'apps/kma-athena/**/*.{ts,tsx}',
        'packages/ui-components/**/*.{ts,tsx}',
      ],
      env: { browser: true, node: true },
      plugins: ['react', 'react-hooks', 'react-refresh'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: { react: { version: 'detect' } },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      },
    },
    // (B) Pure TS
    {
      files: ['packages/api-interface/**/*.ts', 'packages/auth/**/*.ts', 'packages/utils/**/*.ts'],
      env: { node: true, browser: false },
      rules: { 'no-console': 'off' },
    },
  ],
};
