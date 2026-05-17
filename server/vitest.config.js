import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    fileParallelism: false,
    hookTimeout: 60000,
    testTimeout: 30000,
  },
});
