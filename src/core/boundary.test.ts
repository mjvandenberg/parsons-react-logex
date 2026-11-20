import { test, expect } from 'vitest';

// Guards the goal of src/core: plain TypeScript with no framework or
// third-party runtime imports, so it can back a future Web Component.
const sources = import.meta.glob<string>('./**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});

test('src/core only imports its own modules', () => {
  const offending = Object.entries(sources).flatMap(([file, source]) =>
    [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)]
      .map((m) => m[1])
      .filter((spec) => !spec.startsWith('.') && !(file.endsWith('.test.ts') && spec === 'vitest'))
      .map((spec) => `${file}: ${spec}`)
  );
  expect(Object.keys(sources).length).toBeGreaterThan(5);
  expect(offending).toEqual([]);
});
