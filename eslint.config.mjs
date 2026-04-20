import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/**', 'eslint.config.mjs'] },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        Chart: 'readonly',
      },
    },
    rules: {
      // Las funciones se enlazan desde index.html (onclick, etc.)
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
