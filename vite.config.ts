//import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'import.meta.vitest': 'undefined' },
  test: {
    exclude: [...configDefaults.exclude, '**/__mocks__/**', '**/__tests__/**'],
    includeSource: ['src/**/*.ts'],
  },
  plugins: [react()],
});
