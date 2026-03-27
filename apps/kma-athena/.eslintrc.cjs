module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  overrides: [
    {
      files: ['next.config.mjs'],
      parser: 'espree',
    },
  ],
};
