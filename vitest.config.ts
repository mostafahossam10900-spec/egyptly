import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Integration tests talk to the local Supabase stack; keep them sequential.
    fileParallelism: false,
    testTimeout: 30_000,
  },
})
