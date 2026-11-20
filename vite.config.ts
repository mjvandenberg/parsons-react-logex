import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL ?? '/parsons-react-logex/',
  build: {
    rollupOptions: {
      // The React prototype and the Web Component demo side by side.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        demo: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
      },
    },
  },
  define: {
    __COMMIT_SHA__: JSON.stringify(
      process.env.VITE_COMMIT_SHA?.substring(0, 7) ?? getCommitHash()
    ),
  },
});
