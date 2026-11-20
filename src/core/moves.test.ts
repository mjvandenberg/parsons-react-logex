import { describe, expect, test } from 'vitest';
import { moveBlock } from './moves.js';
import { ParsonsState, ParsonsUiItem } from './types.js';

const block = (id: string, extra: Partial<ParsonsUiItem> = {}): ParsonsUiItem => ({
  id,
  text: id,
  isValid: 'unknown',
  isValidRule: 'unknown',
  ...extra,
});

const state = (): ParsonsState => ({
  left: [block('B', { pairedGroupName: '1' }), block('B*', { pairedGroupName: '1' }), block('C')],
  right: [
    block('A', { isStaticFirst: true, isValid: 'green' }),
    block('X', { rule: 'r', isValid: 'red' }),
    block('D', { isStaticLast: true, isValid: 'green' }),
  ],
});
const ids = (list: ParsonsUiItem[]) => list.map((i) => i.id);

describe('moveBlock', () => {
  test('adds a block just above the last formula by default', () => {
    const next = moveBlock(state(), 'C', 'right');
    expect(ids(next.right)).toEqual(['A', 'X', 'C', 'D']);
    expect(ids(next.left)).toEqual(['B', 'B*']);
  });

  test('adds a block at the given position', () => {
    expect(ids(moveBlock(state(), 'C', 'right', 1).right)).toEqual(['A', 'C', 'X', 'D']);
  });

  test('never places a block before the first or after the last formula', () => {
    expect(ids(moveBlock(state(), 'C', 'right', 0).right)).toEqual(['A', 'C', 'X', 'D']);
    expect(ids(moveBlock(state(), 'C', 'right', 99).right)).toEqual(['A', 'X', 'C', 'D']);
  });

  test('reorders within the solution panel', () => {
    const s = moveBlock(state(), 'C', 'right', 1); // A C X D
    expect(ids(moveBlock(s, 'C', 'right', 2).right)).toEqual(['A', 'X', 'C', 'D']);
    expect(ids(moveBlock(s, 'X', 'right', 1).right)).toEqual(['A', 'X', 'C', 'D']);
  });

  test('does not move the first or last formula', () => {
    const s = state();
    expect(moveBlock(s, 'A', 'left')).toBe(s);
    expect(moveBlock(s, 'D', 'right', 1)).toBe(s);
  });

  test('a block returns next to its paired distractor', () => {
    const s = moveBlock(state(), 'B*', 'right'); // left: B C
    expect(ids(s.left)).toEqual(['B', 'C']);
    expect(ids(moveBlock(s, 'B*', 'left').left)).toEqual(['B', 'B*', 'C']);
  });

  test('a block without a partner returns at the end', () => {
    expect(ids(moveBlock(state(), 'X', 'left').left)).toEqual(['B', 'B*', 'C', 'X']);
  });

  test('a moved block loses its rule and feedback status', () => {
    const moved = moveBlock(state(), 'X', 'left').left.at(-1)!;
    expect(moved).toMatchObject({ rule: undefined, isValid: 'unknown', isValidRule: 'unknown' });
  });

  test('works with an empty solution panel and unknown ids', () => {
    const s: ParsonsState = { left: [block('B')], right: [] };
    expect(ids(moveBlock(s, 'B', 'right').right)).toEqual(['B']);
    expect(moveBlock(s, 'nope', 'right')).toBe(s);
  });
});
