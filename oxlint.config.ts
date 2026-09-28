import { oxlint } from 'oxc-config-mantine';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [oxlint],
  ignorePatterns: ['**/*.{mjs,cjs,js,d.ts,d.mts}'],
});
