// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  // `.claude/` holds Claude Code worktrees (full copies of the repo) and `design-handoff-docs/`
  // is untracked reference material — neither is this site's source.
  globalIgnores([
    'dist/**',
    '.astro/**',
    'node_modules/**',
    '.claude/**',
    'design-handoff-docs/**',
  ]),
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
    // eslint-plugin-astro auto-detects `@typescript-eslint/parser` for the frontmatter, but
    // pnpm's strict node_modules hides it (only the `typescript-eslint` meta package is a
    // direct dependency), so it silently fell back to plain JS and failed on `interface`.
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
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
