// Moving formula blocks between and within the two panels, as a pure function.
// Validation of the solution panel is left to the caller.
import { ParsonsState, ParsonsUiItem } from './types.js';

export type Panel = 'left' | 'right';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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
export const moveBlock = (
  state: ParsonsState,
  id: ParsonsUiItem['id'],
  to: Panel,
  index?: number
): ParsonsState => {
  const item = state.left.find((i) => i.id === id) ?? state.right.find((i) => i.id === id);
  if (!item || item.isStaticFirst || item.isStaticLast) return state;

  const left = state.left.filter((i) => i !== item);
  const right = state.right.filter((i) => i !== item);
  const moved: ParsonsUiItem = {
    ...item,
    rule: undefined,
    isValid: 'unknown',
    isValidRule: 'unknown',
  };

  if (to === 'right') {
    const last = Math.max(right.length - 1, 0);
    right.splice(clamp(index ?? last, Math.min(1, last), last), 0, moved);
  } else {
    const partner = item.pairedGroupName
      ? left.findIndex((i) => i.pairedGroupName === item.pairedGroupName)
      : -1;
    left.splice(partner >= 0 ? partner + 1 : left.length, 0, moved);
  }

  return { left, right };
};
