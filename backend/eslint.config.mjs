// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // Change to 'module' because NestJS/TS files are processed as ESM 
      // and you are using import.meta in this config.
      sourceType: 'module', 
      parserOptions: {
        project: './tsconfig.json', // Explicitly point to your tsconfig
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // This is the specific rule hitting your decorators
      '@typescript-eslint/no-unsafe-call': 'off', 
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-unsafe-finally': 'warn',
    },
  },
);