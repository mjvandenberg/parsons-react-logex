// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import './index.js';
import { solutionIndex } from './drag.js';
import type { ParsonsProof } from './parsons-proof.js';
import exercise1 from '../core/logex/data/equivalence/oneFinal1.js';

const STEP_1 = '¬(p ∧ q) ∨ ¬r ∨ s';
const STEP_2 = '¬(p ∧ q) ∨ (r → s)';

describe('solutionIndex', () => {
  // Blocks with midpoints at 20, 70, 120, 170 (first and last are fixed)
  const mids = [20, 70, 120, 170];
  test.each([
    [0, 1],
    [50, 1],
    [100, 2],
    [150, 3],
    [500, 3],
  ])('y=%i lands at index %i', (y, index) => expect(solutionIndex(mids, y)).toBe(index));

  test('with only the first and last formula, lands between them', () => {
    expect(solutionIndex([20, 70], 0)).toBe(1);
    expect(solutionIndex([20, 70], 999)).toBe(1);
  });
});

// happy-dom does no layout, so give lists and blocks a simple geometry:
// source list at x 0–400, solution list at x 500–900, blocks 50px apart.
const LIST_X = { source: 0, target: 500 };
const fakeRect = function (this: HTMLElement) {
  const list = this.classList.contains('list') ? this : this.closest('.list');
  const panel = this.closest('.target') ? 'target' : 'source';
  const x = LIST_X[panel];
  if (this.classList.contains('list')) return new DOMRect(x, 0, 400, 400);
  if (this.classList.contains('block') && list) {
    const i = [...list.querySelectorAll('.block')].indexOf(this);
    return new DOMRect(x, 10 + i * 50, 400, 40);
  }
  return new DOMRect(0, 0, 0, 0);
};

const pointer = (target: EventTarget, type: string, x: number, y: number) =>
  target.dispatchEvent(
    new PointerEvent(type, {
      clientX: x,
      clientY: y,
      button: 0,
      isPrimary: true,
      pointerId: 1,
      bubbles: true,
      composed: true,
      cancelable: true,
    })
  );

const mount = () => {
  const el = document.createElement('parsons-proof');
  document.body.append(el);
  el.exercise = exercise1;
  return el;
};
const blockByText = (el: ParsonsProof, text: string) =>
  [...el.shadowRoot!.querySelectorAll<HTMLElement>('button.block')].find((b) =>
    b.textContent?.includes(text)
  )!;
const texts = (el: ParsonsProof) => el.state.right.map((i) => i.text);

const dragTo = (el: ParsonsProof, block: HTMLElement, x: number, y: number) => {
  const box = block.getBoundingClientRect();
  pointer(block, 'pointerdown', box.left + 5, box.top + 5);
  pointer(window, 'pointermove', box.left + 20, box.top + 20);
  pointer(window, 'pointermove', x, y);
  pointer(window, 'pointerup', x, y);
};

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(fakeRect);
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe('dragging blocks', () => {
  test('drops a block between the first and last formula', () => {
    const el = mount();
    dragTo(el, blockByText(el, STEP_2), 600, 40);
    expect(texts(el)).toEqual([texts(el)[0], STEP_2, texts(el)[2]]);
  });

  test('drops a block at the pointer position and reorders within the solution', () => {
    const el = mount();
    dragTo(el, blockByText(el, STEP_2), 600, 40); // first, STEP_2, last
    dragTo(el, blockByText(el, STEP_1), 600, 40); // midpoints 30, 80, 130 → index 1
    expect(texts(el).slice(1, 3)).toEqual([STEP_1, STEP_2]);

    // Without STEP_1 itself the midpoints are 30, 130 (STEP_2), 180 (last).
    dragTo(el, blockByText(el, STEP_1), 600, 150);
    expect(texts(el).slice(1, 3)).toEqual([STEP_2, STEP_1]);
  });

  test('dropping on the problem panel moves a block back', () => {
    const el = mount();
    dragTo(el, blockByText(el, STEP_1), 600, 40);
    dragTo(el, blockByText(el, STEP_1), 100, 100);
    expect(texts(el)).not.toContain(STEP_1);
    expect(el.state.left.map((i) => i.text)).toContain(STEP_1);
  });

  test('dropping outside both panels changes nothing', () => {
    const el = mount();
    const onChange = vi.fn();
    el.addEventListener('parsons-change', onChange);
    dragTo(el, blockByText(el, STEP_1), 450, 900);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('the click that ends a drag does not also move the block', () => {
    const el = mount();
    const block = blockByText(el, STEP_1);
    dragTo(el, block, 100, 100); // drop on its own panel: no-op
    block.click();
    expect(texts(el)).not.toContain(STEP_1);
  });

  test('Escape cancels a drag', () => {
    const el = mount();
    const block = blockByText(el, STEP_1);
    pointer(block, 'pointerdown', 5, 15);
    pointer(window, 'pointermove', 600, 40);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    pointer(window, 'pointerup', 600, 40);
    expect(texts(el)).not.toContain(STEP_1);
  });

  test('a short pointer press is a click, not a drag', () => {
    const el = mount();
    const block = blockByText(el, STEP_1);
    pointer(block, 'pointerdown', 5, 15);
    pointer(window, 'pointerup', 7, 16);
    block.click();
    expect(texts(el)).toContain(STEP_1);
  });
});

describe('keyboard', () => {
  const key = (target: HTMLElement, k: string, altKey = false) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, altKey, bubbles: true, composed: true }));

  test('Alt+Arrow keys reorder the solution and announce the move', () => {
    const el = mount();
    blockByText(el, STEP_1).click();
    blockByText(el, STEP_2).click(); // first, STEP_1, STEP_2, last
    key(blockByText(el, STEP_2), 'ArrowUp', true);
    expect(texts(el).slice(1, 3)).toEqual([STEP_2, STEP_1]);
    expect(el.shadowRoot!.querySelector('[aria-live]')!.textContent).toContain('step 2 of 4');

    key(blockByText(el, STEP_2), 'ArrowUp', true); // already right below the first formula
    expect(texts(el).slice(1, 3)).toEqual([STEP_2, STEP_1]);
  });

  test('Arrow keys without Alt move focus within a panel', () => {
    const el = mount();
    const [first, second] = el.shadowRoot!.querySelectorAll<HTMLElement>('.source button.block');
    first.focus();
    key(first, 'ArrowDown');
    expect(el.shadowRoot!.activeElement).toBe(second);
  });
});
