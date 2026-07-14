import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Unit-test config. The suite targets the pure security and integrity primitives
 * — file-signature sniffing, signed URLs, rate limiting, origin checks — the
 * logic that is easiest to get subtly wrong and most expensive to get wrong.
 *
 * `node` environment on purpose: these are server modules, no DOM. The one
 * alias mirrors tsconfig's `@/* -> src/*` so tests import exactly what the app
 * imports.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A green suite with zero tests is a lie the pipeline would happily ship, so
    // do NOT pass with no tests — an empty run is a failed run.
    passWithNoTests: false,
  },
});
