# Repository Instructions

## Testing Strategy

Prefer pure functional tests for deterministic behavior, following the existing utility test style in `src/utils/*.test.ts` and `src/hooks/*.test.ts`.

Do not add mock-based tests for behavior that can be covered by extracting pure utilities. For UI/library integration, keep component code thin and put app-specific decisions in testable pure functions.

## UI Target

Treat mobile as the primary target for app views. Keep controls and rendered learning prompts compact, readable, and usable on narrow screens first.

## Verification

Use `npm run verify` as the final verification command.

Do not run `prettier`, `lint`, `typecheck`, or `vitest` one by one as final checks. Narrower commands may be used only to diagnose a failing `npm run verify`, then rerun `npm run verify` after fixes.
