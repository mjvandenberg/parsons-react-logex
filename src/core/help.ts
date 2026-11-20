// Help options for the learner (hint, complete one step, complete exercise),
// as pure functions over the panel state. They return a new state and never
// mutate their input. Validation of the returned solution panel is left to
// the caller (see validateParsonsProblemFromUi).
import { ParsonsItem, ParsonsState, ParsonsUiItem } from './types.js';
import { countNumberOfItemsValid } from './validate.js';

/**
 * Hint: the first formula block of the solution, from the top, that is not
 * in its place in the solution panel. Undefined when no such block exists.
 */
export const findHintBlock = (
  solution: ParsonsItem[],
  right: ParsonsUiItem[]
): ParsonsItem | undefined =>
  solution.find(
    (item, index) => index % 2 === 0 && right[index / 2]?.text !== item.text
  );

/** A block in the solution panel that is not part of the solution (a distractor). */
export const findDistractor = (
  solution: ParsonsItem[],
  right: ParsonsUiItem[]
): ParsonsUiItem | undefined =>
  right.find(
    (item) =>
      solution.find((s) => s.text === item.text && s.type === 'block') ===
      undefined
  );

const findTopDownIndex = (solution: ParsonsItem[], right: ParsonsUiItem[]) =>
  solution.findIndex(
    (item, index) => index % 2 === 0 && right[index / 2]?.text !== item.text
  );

const findBottomUpIndex = (
  solution: ParsonsItem[],
  right: ParsonsUiItem[]
): { indexToAdd: number; solutionIndex: number } => {
  for (let x = 0; x < right.length; x++) {
    const solutionIndex = solution.length - 1 - 2 * x;
    if (right[right.length - 1 - x].text !== solution[solutionIndex]?.text) {
      return { indexToAdd: right.length - 1 - x, solutionIndex };
    }
  }
  return { indexToAdd: -1, solutionIndex: -1 };
};

const removeBlock = (list: ParsonsUiItem[], text: string) =>
  list.filter((item) => item.text !== text);

const insertTopDown = (
  state: ParsonsState,
  solution: ParsonsItem[],
  index: number
): ParsonsState => ({
  left: removeBlock(state.left, solution[index].text),
  right: state.right.flatMap((item, i) =>
    i === index / 2
      ? [
          {
            ...solution[index],
            id: `hinteditem_${index}`,
            isValid: 'green',
            isValidRule: 'red',
            rule: index === 0 ? undefined : solution[index - 1].text,
          } as ParsonsUiItem,
          item,
        ]
      : [item]
  ),
});

const insertBottomUp = (
  state: ParsonsState,
  solution: ParsonsItem[],
  indexToAdd: number,
  solutionIndex: number
): ParsonsState => ({
  left: removeBlock(state.left, solution[solutionIndex].text),
  right: state.right.flatMap((item, i) =>
    i === indexToAdd + 1
      ? [
          {
            ...solution[solutionIndex],
            id: `hinteditem_${solutionIndex}`,
            isValid: 'green',
            isValidRule: 'red',
          } as ParsonsUiItem,
          { ...item, rule: solution[solutionIndex + 1].text },
        ]
      : [item]
  ),
});

/**
 * Work from the side with fewer correct items; on a tie, pick a side at random.
 * `random` is injectable so the choice is deterministic in tests.
 */
const shouldWorkTopDown = (
  right: ParsonsUiItem[],
  random: () => number
): boolean => {
  const down = countNumberOfItemsValid(right, 'downwards');
  const up = countNumberOfItemsValid(right, 'upwards');
  return random() >= 0.5 ? down < up : down <= up;
};

/** Help option "Complete my exercise": put the full solution in the solution panel. */
export const completeExercise = (
  state: ParsonsState,
  solution: ParsonsItem[]
): ParsonsState => ({
  left: state.left.filter(
    (item) => solution.findIndex((s) => s.text === item.text) === -1
  ),
  right: solution.flatMap((item, index, arr) =>
    index % 2 === 0
      ? [
          {
            ...item,
            id: `hinteditem_${index}`,
            isValid: 'green',
            isValidRule: 'green',
            rule: index === 0 ? undefined : arr[index - 1].text,
          } as ParsonsUiItem,
        ]
      : []
  ),
});

/**
 * Help option "Complete one step": first move a distractor back out of the
 * solution panel; otherwise add one correct block, from the top or from the
 * bottom. Falls back to completing the exercise when no step can be found.
 */
export const completeStep = (
  state: ParsonsState,
  solution: ParsonsItem[],
  random: () => number = Math.random
): ParsonsState => {
  const distractor = findDistractor(solution, state.right);
  if (distractor) {
    return {
      left: [...state.left, distractor],
      right: removeBlock(state.right, distractor.text),
    };
  }

  if (shouldWorkTopDown(state.right, random)) {
    const index = findTopDownIndex(solution, state.right);
    return index === -1
      ? completeExercise(state, solution)
      : insertTopDown(state, solution, index);
  }

  const { indexToAdd, solutionIndex } = findBottomUpIndex(solution, state.right);
  return indexToAdd === -1
    ? completeExercise(state, solution)
    : insertBottomUp(state, solution, indexToAdd, solutionIndex);
};
