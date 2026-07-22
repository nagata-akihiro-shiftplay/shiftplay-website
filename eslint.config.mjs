// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['dist/**', '.astro/**', 'node_modules/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      // Japanese copy throughout this site legitimately uses full-width spaces
      // (U+3000) as a visual separator (e.g. "代表取締役 永田 晃大"), matching the
      // handoff's own text verbatim — not a stray/accidental character. Scoped to
      // .astro templates only so it still catches accidental irregular whitespace
      // in .ts logic files.
      'no-irregular-whitespace': 'off',
    },
  },
  eslintConfigPrettier,
);
