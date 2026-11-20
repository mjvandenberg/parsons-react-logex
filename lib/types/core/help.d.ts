import { ParsonsItem, ParsonsState, ParsonsUiItem } from './types.js';
/**
 * Hint: the first formula block of the solution, from the top, that is not
 * in its place in the solution panel. Undefined when no such block exists.
 */
export declare const findHintBlock: (solution: ParsonsItem[], right: ParsonsUiItem[]) => ParsonsItem | undefined;
/** A block in the solution panel that is not part of the solution (a distractor). */
export declare const findDistractor: (solution: ParsonsItem[], right: ParsonsUiItem[]) => ParsonsUiItem | undefined;
/** Help option "Complete my exercise": put the full solution in the solution panel. */
export declare const completeExercise: (state: ParsonsState, solution: ParsonsItem[]) => ParsonsState;
/**
 * Help option "Complete one step": first move a distractor back out of the
 * solution panel; otherwise add one correct block, from the top or from the
 * bottom. Falls back to completing the exercise when no step can be found.
 */
export declare const completeStep: (state: ParsonsState, solution: ParsonsItem[], random?: () => number) => ParsonsState;
