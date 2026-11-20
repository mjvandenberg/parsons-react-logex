import { describe, test, expect } from 'vitest';
import {
  completeExercise,
  completeStep,
  findDistractor,
  findHintBlock,
} from './help.js';
import { validateParsonsProblemFromUi } from './validate.js';
import { oneFinalToParsonsProblem } from './logex/logExHelpers.js';
import allExercises from './logex/data/equivalence/all.js';
import { ParsonsItem, ParsonsState, ParsonsUiItem } from './types.js';

// Solution A =r1= B =r2= C =r3= D
const solution: ParsonsItem[] = [
  { text: 'A', type: 'block' },
  { text: 'r1', type: 'rule' },
  { text: 'B', type: 'block' },
  { text: 'r2', type: 'rule' },
  { text: 'C', type: 'block' },
  { text: 'r3', type: 'rule' },
  { text: 'D', type: 'block' },
];

const block = (text: string, rule?: string): ParsonsUiItem => ({
  id: text,
  text,
  rule,
  isValid: 'unknown',
  isValidRule: 'unknown',
});

const texts = (list: ParsonsUiItem[]) => list.map((i) => i.text);
const start = (): ParsonsState => ({
  left: [block('B'), block('X'), block('C')],
  right: [block('A'), block('D')],
});
const alwaysTopDown = () => 0;
const alwaysBottomUp = () => 0.9;

describe('findHintBlock', () => {
  test('returns the first block from the top that is not in place', () => {
    expect(findHintBlock(solution, start().right)?.text).toBe('B');
  });

  test('returns undefined when all blocks are in place', () => {
    const right = ['A', 'B', 'C', 'D'].map((t) => block(t));
    expect(findHintBlock(solution, right)).toBeUndefined();
  });
});

describe('completeStep', () => {
  test('moves a distractor from the solution panel back to the problem panel', () => {
    const state: ParsonsState = {
      left: [block('B'), block('C')],
      right: [block('A'), block('X'), block('D')],
    };
    expect(findDistractor(solution, state.right)?.text).toBe('X');

    const next = completeStep(state, solution, alwaysTopDown);

    expect(texts(next.right)).toEqual(['A', 'D']);
    expect(texts(next.left)).toEqual(['B', 'C', 'X']);
  });

  test('adds the next block from the top, with its rewrite rule', () => {
    const next = completeStep(start(), solution, alwaysTopDown);

    expect(texts(next.right)).toEqual(['A', 'B', 'D']);
    expect(next.right[1].rule).toBe('r1');
    expect(texts(next.left)).toEqual(['X', 'C']);
  });

  test('adds the next block from the bottom, and sets the rule below it', () => {
    const next = completeStep(start(), solution, alwaysBottomUp);

    expect(texts(next.right)).toEqual(['A', 'C', 'D']);
    expect(next.right[2].rule).toBe('r3');
    expect(texts(next.left)).toEqual(['B', 'X']);
  });

  test('completes the exercise when every block is already in place', () => {
    const state: ParsonsState = {
      left: [block('X')],
      right: ['A', 'B', 'C', 'D'].map((t) => block(t)),
    };
    const next = completeStep(state, solution, alwaysTopDown);
    expect(next).toEqual(completeExercise(state, solution));
  });

  test('does not mutate its input', () => {
    const state = start();
    const copy = structuredClone(state);
    completeStep(state, solution, alwaysTopDown);
    completeStep(state, solution, alwaysBottomUp);
    expect(state).toEqual(copy);
  });
});

describe('completeExercise', () => {
  test('puts all blocks with their rules in the solution panel and leaves only distractors', () => {
    const next = completeExercise(start(), solution);

    expect(texts(next.right)).toEqual(['A', 'B', 'C', 'D']);
    expect(next.right.map((i) => i.rule)).toEqual([undefined, 'r1', 'r2', 'r3']);
    expect(texts(next.left)).toEqual(['X']);
  });
});

describe('with the LogEx exercises', () => {
  test.each(Object.keys(allExercises))(
    '%s: repeated "complete one step" ends in a valid solution',
    (name) => {
      const problem = oneFinalToParsonsProblem(
        allExercises[name as keyof typeof allExercises],
        'equivalence',
        true
      );
      let state: ParsonsState = { left: problem.listLeft, right: problem.listRight };
      let isValid = false;

      for (let step = 0; step < 50 && !isValid; step++) {
        state = completeStep(state, problem.exerciseSolution, () => (step % 3) / 3);
        const [right, valid] = validateParsonsProblemFromUi(
          state.right,
          problem.exerciseSolution,
          false
        );
        state = { ...state, right };
        isValid = valid;
      }

      expect(isValid).toBe(true);
    }
  );
});
