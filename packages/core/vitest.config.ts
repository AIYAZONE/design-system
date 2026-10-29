import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup-tests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 60,
        statements: 60,
        branches: 60,
        functions: 60
      },
      include: [
        'src/components/button/index.ts',
        'src/components/badge/index.ts',
        'src/components/checkbox/index.ts',
        'src/components/dialog/index.ts',
        'src/components/filter-select/index.ts'
      ],
      exclude: [
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/__tests__/helpers/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@jackery/utils': resolve(__dirname, '../utils/src'),
      '@jackery/i18n': resolve(__dirname, '../i18n/src')
    }
  }
})
