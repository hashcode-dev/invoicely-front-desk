import { defineConfig } from 'vitest/config';

// Phase 0 in-progress: the browser-environment test setup and the coverage tool
// wiring are queued but blocked on six additional devDependencies being installed.
// See memories/session/invoicely-audit.md and docs/adr/ (once written) for the
// staged config to swap in once the registry is reachable.

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
