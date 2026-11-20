import { test, expect } from 'vitest';

// Guards the goal of src/core and src/element: plain TypeScript with no
// framework or third-party runtime imports.
const sources = import.meta.glob<string>(['./**/*.ts', '../element/**/*.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

test('src/core and src/element only import their own modules', () => {
  const offending = Object.entries(sources).flatMap(([file, source]) =>
    [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)]
      .map((m) => m[1])
      .filter((spec) => !spec.startsWith('.'))
      .filter((spec) => !(file.endsWith('.test.ts') && spec === 'vitest'))
      .map((spec) => `${file}: ${spec}`)
  );
  expect(Object.keys(sources).length).toBeGreaterThan(5);
  expect(offending).toEqual([]);
});
