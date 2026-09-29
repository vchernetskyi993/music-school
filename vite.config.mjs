import * as child from 'child_process';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
  base: '/music-school/',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
    isolate: false,
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              test: /react/,
              name: 'react',
            },
            {
              test: /mantine/,
              name: 'mantine',
            },
            {
              test: /vexflow1.*bravura/,
              name: 'vexflow-bravura',
            },
            {
              test: /vexflow.*petaluma/,
              name: 'vexflow-petaluma',
            },
            {
              test: /vexflow.*fonts/,
              name: 'vexflow-fonts',
            },
          ],
        },
      },
    },
  },
});
