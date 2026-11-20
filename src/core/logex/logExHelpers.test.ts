import { describe, test, expect } from 'vitest';
import { oneFinalToParsonsProblem } from './logExHelpers';
import exercise1 from './data/equivalence/oneFinal1';

describe('oneFinalToParsonsProblem', () => {
  const problem = oneFinalToParsonsProblem(exercise1, 'equivalence', true);
  const blocks = problem.exerciseSolution.filter((i) => i.type === 'block');

  test('describes the exercise as data', () => {
    expect(problem.exerciseDescription).toEqual({
      type: 'equivalence',
      from: '¬(p ∧ q) ∨ s ∨ ¬r',
      to: '(p ∧ q) → (r → s)',
    });
  });

  test('alternates blocks and rules, starting and ending with a block', () => {
    problem.exerciseSolution.forEach((item, index) =>
      expect(item.type).toBe(index % 2 === 0 ? 'block' : 'rule')
    );
    expect(problem.exerciseSolution.length % 2).toBe(1);
  });

  test('starts with the first and last formula in the solution panel', () => {
    expect(problem.listRight.map((i) => i.text)).toEqual([
      blocks[0].text,
      blocks.at(-1)!.text,
    ]);
  });

  test('puts the middle formulas and the distractor in the problem panel', () => {
    const left = problem.listLeft.map((i) => i.text).sort();
    const expected = [
      ...blocks.slice(1, -1).map((b) => b.text),
      '¬(p ∧ q) ∨ ¬(r → s)',
    ].sort();
    expect(left).toEqual(expected);
  });
});
