// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from 'vitest';
import './index.js';
import type { ParsonsProof } from './parsons-proof.js';
import exercise1 from '../core/logex/data/equivalence/oneFinal1.js';

// Exercise 1: ¬(p ∧ q) ∨ s ∨ ¬r  =comm=  ¬(p ∧ q) ∨ ¬r ∨ s  =impl=
//             ¬(p ∧ q) ∨ (r → s)  =impl=  (p ∧ q) → (r → s)
const STEP_1 = '¬(p ∧ q) ∨ ¬r ∨ s';
const STEP_2 = '¬(p ∧ q) ∨ (r → s)';
const DISTRACTOR = '¬(p ∧ q) ∨ ¬(r → s)';
const RULES = [
  'rule.logic.propositional.commutativity',
  'rule.logic.propositional.implication',
  'rule.logic.propositional.implication',
];

const mount = (attributes: Record<string, string> = {}) => {
  const el = document.createElement('parsons-proof');
  Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
  document.body.append(el);
  el.exercise = exercise1;
  return el;
};

const $ = (el: ParsonsProof, selector: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(selector);
const $$ = (el: ParsonsProof, selector: string) => [
  ...el.shadowRoot!.querySelectorAll<HTMLElement>(selector),
];
const sourceBlock = (el: ParsonsProof, text: string) =>
  $$(el, '.source button.block').find((b) => b.textContent?.includes(text))!;
const addSteps = (el: ParsonsProof) => {
  sourceBlock(el, STEP_1).click();
  sourceBlock(el, STEP_2).click();
};
const chooseRules = (el: ParsonsProof) =>
  RULES.forEach((rule, i) => {
    $$(el, 'button.rule')[i].click();
    $(el, `[data-rule="${rule}"]`)!.click();
  });

afterEach(() => document.body.replaceChildren());

describe('<parsons-proof>', () => {
  test('renders the exercise with the first and last formula in the solution', () => {
    const el = mount();

    expect($(el, '.title')!.textContent).toContain('Exercise 1');
    expect($(el, '.title')!.textContent).toContain('is logically equivalent to');
    expect($$(el, '.target .block')).toHaveLength(2);
    expect($$(el, '.target .rule')).toHaveLength(1);
    expect($$(el, '.source .block')).toHaveLength(3);
    expect($$(el, '.source .pair')).toHaveLength(1);
  });

  test('clicking a block moves it into the solution and back', () => {
    const el = mount();
    const onChange = vi.fn();
    el.addEventListener('parsons-change', onChange);

    sourceBlock(el, STEP_1).click();
    expect(el.state.right.map((i) => i.text)).toContain(STEP_1);
    expect(onChange).toHaveBeenCalledTimes(1);

    $$(el, '.target button.block')[0].click();
    expect(el.state.right.map((i) => i.text)).not.toContain(STEP_1);
    expect(el.state.left.map((i) => i.text)).toContain(STEP_1);
  });

  test('the first and last formula cannot be moved out', () => {
    const el = mount();
    expect($$(el, '.target button.block')).toHaveLength(0);
  });

  test('blocks plus correct rules make a valid solution', () => {
    const el = mount();
    const onSolved = vi.fn();
    el.addEventListener('parsons-solved', onSolved);

    addSteps(el);
    expect(el.isValid).toBe(false);
    chooseRules(el);

    expect(el.isValid).toBe(true);
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect($(el, '#target-title')!.textContent).toBe('Congratulations, your solution is valid!');
    expect($(el, '.target')!.dataset.valid).toBe('true');
    expect($$(el, '.target .block').every((b) => b.dataset.status === 'green')).toBe(true);
  });

  test('auto-fill-rules fills in the rules for correctly placed blocks', () => {
    const el = mount({ 'auto-fill-rules': '' });
    addSteps(el);

    expect(el.isValid).toBe(true);
    expect(el.state.right.slice(1).map((i) => i.rule)).toEqual(RULES);
    expect($$(el, 'button.rule').every((b) => b.hasAttribute('disabled'))).toBe(true);
  });

  test('feedback is hidden until checked, unless live-feedback is set', () => {
    const el = mount();
    sourceBlock(el, DISTRACTOR).click();
    expect($(el, '.target')!.dataset.valid).toBeUndefined();
    expect(el.check()).toBe(false);
    expect($(el, '.target')!.dataset.valid).toBe('false');

    const live = mount({ 'live-feedback': '' });
    sourceBlock(live, DISTRACTOR).click();
    expect($(live, '.target')!.dataset.valid).toBe('false');
    expect($$(live, '.toolbar button').map((b) => b.textContent)).not.toContain('Check solution');
  });

  test('only-correct shows green items and hides red ones', () => {
    const el = mount({ 'only-correct': '' });
    sourceBlock(el, DISTRACTOR).click();
    el.check();

    expect(el.state.right.map((i) => i.isValid)).toContain('red');
    expect($$(el, '.target .block').map((b) => b.dataset.status)).not.toContain('red');
  });

  test('help: hint, complete one step and complete my exercise', () => {
    const el = mount();
    const onHelp = vi.fn();
    el.addEventListener('parsons-help', onHelp);

    el.hint();
    expect($(el, '.hint')!.textContent).toContain(STEP_1);

    el.completeStep();
    expect(el.state.right.length).toBe(3);
    expect($(el, '.hint')).toBeNull();

    el.solve();
    expect(el.isValid).toBe(true);
    expect(el.state.left.map((i) => i.text)).toEqual([DISTRACTOR]);
    expect(onHelp.mock.calls.map(([e]) => e.detail.kind)).toEqual(['hint', 'step', 'solve']);
  });

  test('show complete solution opens a dialog without changing the work', () => {
    const el = mount();
    const onHelp = vi.fn();
    el.addEventListener('parsons-help', onHelp);
    const before = el.state;

    el.showSolution();

    const dialog = $(el, 'dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    expect($$(el, 'dialog .block')).toHaveLength(4);
    expect($$(el, 'dialog .rule').map((r) => r.textContent)).toEqual([
      'Commutativity',
      'Implication definition',
      'Implication definition',
    ]);
    expect(el.state).toEqual(before);
    expect(onHelp.mock.calls[0][0].detail.kind).toBe('show-solution');

    el.showSolution(); // reuses the same dialog
    expect($$(el, 'dialog')).toHaveLength(1);
  });

  test('reset starts over', () => {
    const el = mount();
    el.solve();
    el.reset();
    expect(el.isValid).toBe(false);
    expect(el.state.right).toHaveLength(2);
    expect(el.state.left).toHaveLength(3);
  });

  test('no-distractors leaves out the distractor block', () => {
    const el = mount({ 'no-distractors': '' });
    expect(el.state.left.map((i) => i.text)).not.toContain(DISTRACTOR);
  });

  test('uses the language of the nearest lang attribute', () => {
    document.documentElement.setAttribute('lang', 'nl');
    try {
      const el = mount();
      expect($(el, '.title')!.textContent).toContain('logisch equivalent');
      expect($(el, '#source-title')!.textContent).toBe('Sleep vanaf hier');
    } finally {
      document.documentElement.removeAttribute('lang');
    }
  });

  test('settings maps onto the attributes', () => {
    const el = mount();
    el.settings = { instantFeedback: true, markInvalidItems: false, autoFillRewriteRules: true };
    expect(el.hasAttribute('live-feedback')).toBe(true);
    expect(el.hasAttribute('only-correct')).toBe(true);
    expect(el.hasAttribute('auto-fill-rules')).toBe(true);
  });
});
