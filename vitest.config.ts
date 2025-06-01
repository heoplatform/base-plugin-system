import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Optional: to use Vitest globals like describe, it, expect without importing
    environment: 'node', // Specify the test environment
    include: ['tests/**/*.test.ts'], // Pattern to find test files
  },
}); 