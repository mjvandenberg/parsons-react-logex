import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

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
  define: {
    __COMMIT_SHA__: JSON.stringify(
      process.env.VITE_COMMIT_SHA?.substring(0, 7) ?? getCommitHash()
    ),
  },
});
