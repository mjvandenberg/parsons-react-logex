import { ParsonsState, ParsonsUiItem } from './types.js';
export type Panel = 'left' | 'right';
/**
 * Move block `id` to the problem panel (`left`) or the solution panel (`right`).
 *
 * - In the solution panel the first and last formula are fixed: they cannot be
 *   moved and nothing can be placed before the first or after the last one.
 *   `index` is the position in the solution panel after the block has been
 *   taken out; it defaults to just above the last formula.
 * - In the problem panel order carries no meaning, so a block returns next to
 *   its paired distractor (same `pairedGroupName`) if that is still there, and
 *   otherwise at the end.
 * - A moved block loses its rewrite rule: the rule described its old position.
 */
export declare const moveBlock: (state: ParsonsState, id: ParsonsUiItem['id'], to: Panel, index?: number) => ParsonsState;
