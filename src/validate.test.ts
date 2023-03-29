import { expect, test, assert } from 'vitest';

test('Math.sqrt()', () => {
  assert.equal(Math.sqrt(4), 2);
  assert.equal(Math.sqrt(144), 12);
  assert.equal(Math.sqrt(2), Math.SQRT2);
});
