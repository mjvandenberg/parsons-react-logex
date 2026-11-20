// <parsons-proof>: a Parsons problem for logical equivalence proofs as a
// native Web Component. No runtime dependencies; the domain logic lives in
// ../core and this file only owns state, rendering and events.
//
// Attributes: live-feedback, only-correct, auto-fill-rules, no-distractors, lang
// Properties: exercise (LogEx oneFinal response), problem, settings, state, isValid
// Methods:    check(), hint(), completeStep(), solve(), reset()
// Events:     parsons-change, parsons-solved, parsons-help
//
// Moving blocks is click-based in this phase (click a block to add it to the
// solution, click it again to move it back); drag and drop follows later.
import css from './styles.css?raw';
import { completeExercise, completeStep, findHintBlock } from '../core/help';
import { oneFinalToParsonsProblem } from '../core/logex/logExHelpers';
import { rules } from '../core/logex/rules';
import { OneFinalResponse } from '../core/logex/typesOneFinal';
import {
  ParsonsProblem,
  ParsonsState,
  ParsonsStatus,
  ParsonsUiItem,
  Settings,
} from '../core/types';
import { validateParsonsProblemFromUi } from '../core/validate';
import { Messages, messagesFor } from './i18n';

export type ParsonsChangeDetail = ParsonsState & { isValid: boolean };
export type ParsonsHelpDetail = { kind: 'hint' | 'step' | 'solve' };

type Child = Node | string | false | null | undefined;

/** Minimal element factory: `on*` keys become listeners, `true` a bare attribute. */
const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, unknown> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (typeof value === 'function') {
      el.addEventListener(key.slice(2), value as EventListener);
    } else {
      el.setAttribute(key, value === true ? '' : String(value));
    }
  }
  el.append(...(children.filter((c) => c || c === '') as (Node | string)[]));
  return el;
};

const formula = (text: string) => h('span', { class: 'formula' }, text);

let sharedSheet: CSSStyleSheet | undefined;
const applyStyles = (root: ShadowRoot) => {
  try {
    if (!sharedSheet) {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(css);
    }
    root.adoptedStyleSheets = [sharedSheet];
  } catch {
    root.append(h('style', {}, css));
  }
};

const BOOLEAN_ATTRIBUTES = [
  'live-feedback',
  'only-correct',
  'auto-fill-rules',
  'no-distractors',
] as const;

export class ParsonsProof extends HTMLElement {
  static observedAttributes = [...BOOLEAN_ATTRIBUTES, 'lang'];

  #view: HTMLElement;
  #announcer: HTMLElement;
  #source?: OneFinalResponse;
  #problem?: ParsonsProblem;
  #left: ParsonsUiItem[] = [];
  #right: ParsonsUiItem[] = [];
  #isValid = false;
  #feedbackVisible = false;
  #hintVisible = false;
  #ruleTarget?: string | number;
  #menuReturnKey?: string;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    applyStyles(root);
    this.#view = h('div', { part: 'root' });
    this.#announcer = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    root.append(this.#view, this.#announcer);
  }

  connectedCallback() {
    // Properties set before the element was defined shadow the accessors.
    for (const prop of ['exercise', 'problem', 'settings'] as const) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        delete (this as Partial<this>)[prop];
        (this as Record<string, unknown>)[prop] = value;
      }
    }
    this.#render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, value: string | null) {
    if (oldValue === value || !this.#problem) return;
    if (name === 'no-distractors') {
      if (this.#source) this.exercise = this.#source;
      return;
    }
    if (name === 'auto-fill-rules') {
      this.#updateRight(
        value === null ? this.#right.map((i) => ({ ...i, rule: undefined })) : this.#right
      );
    } else if (name === 'live-feedback') {
      this.#feedbackVisible = value !== null || this.#isValid;
    }
    this.#render();
  }

  // ---- Public API -------------------------------------------------------

  /** A LogEx `onefinal` response; converted to a problem and shuffled on every reset. */
  get exercise(): OneFinalResponse | undefined {
    return this.#source;
  }
  set exercise(response: OneFinalResponse | undefined) {
    this.#source = response;
    this.#problem = undefined;
    this.reset();
  }

  /** A ready-made problem (no reshuffle on reset). */
  get problem(): ParsonsProblem | undefined {
    return this.#problem;
  }
  set problem(problem: ParsonsProblem | undefined) {
    this.#source = undefined;
    this.#problem = problem;
    this.reset();
  }

  get liveFeedback() {
    return this.hasAttribute('live-feedback');
  }
  set liveFeedback(on: boolean) {
    this.toggleAttribute('live-feedback', on);
  }
  get onlyCorrect() {
    return this.hasAttribute('only-correct');
  }
  set onlyCorrect(on: boolean) {
    this.toggleAttribute('only-correct', on);
  }
  get autoFillRules() {
    return this.hasAttribute('auto-fill-rules');
  }
  set autoFillRules(on: boolean) {
    this.toggleAttribute('auto-fill-rules', on);
  }

  /** The prototype's settings object, mapped onto the attributes. */
  get settings(): Settings {
    return {
      instantFeedback: this.liveFeedback,
      markInvalidItems: !this.onlyCorrect,
      autoFillRewriteRules: this.autoFillRules,
    };
  }
  set settings(s: Settings) {
    this.liveFeedback = s.instantFeedback;
    this.onlyCorrect = !s.markInvalidItems;
    this.autoFillRules = s.autoFillRewriteRules;
  }

  get state(): ParsonsState {
    return {
      left: this.#left.map((i) => ({ ...i })),
      right: this.#right.map((i) => ({ ...i })),
    };
  }

  get isValid() {
    return this.#isValid;
  }

  /** Show feedback on the current solution; returns whether it is valid. */
  check(): boolean {
    this.#feedbackVisible = true;
    this.#render();
    return this.#isValid;
  }

  hint() {
    this.#hintVisible = true;
    this.#emit<ParsonsHelpDetail>('parsons-help', { kind: 'hint' });
    this.#render();
  }

  completeStep() {
    if (!this.#problem) return;
    this.#apply(completeStep(this.state, this.#problem.exerciseSolution));
    this.#emit<ParsonsHelpDetail>('parsons-help', { kind: 'step' });
    this.#render();
  }

  solve() {
    if (!this.#problem) return;
    this.#apply(completeExercise(this.state, this.#problem.exerciseSolution));
    this.#emit<ParsonsHelpDetail>('parsons-help', { kind: 'solve' });
    this.#render();
  }

  reset() {
    if (this.#source) {
      const problem = oneFinalToParsonsProblem(
        this.#source,
        'equivalence',
        !this.hasAttribute('no-distractors')
      );
      this.#problem = { ...problem, exerciseName: this.#source.name ?? problem.exerciseName };
    }
    this.#isValid = false;
    this.#feedbackVisible = this.liveFeedback;
    this.#hintVisible = false;
    if (this.#problem) {
      this.#left = [...this.#problem.listLeft];
      this.#updateRight(this.#problem.listRight);
    } else {
      this.#left = [];
      this.#right = [];
    }
    this.#render();
  }

  // ---- State changes ----------------------------------------------------

  get #t(): Messages {
    return messagesFor(this.closest('[lang]')?.getAttribute('lang'));
  }

  #emit<T>(type: string, detail: T) {
    this.dispatchEvent(new CustomEvent<T>(type, { detail, bubbles: true, composed: true }));
  }

  #apply(state: ParsonsState) {
    this.#left = state.left;
    this.#updateRight(state.right);
  }

  /** Every change to the solution panel is validated, as in the React prototype. */
  #updateRight(list: ParsonsUiItem[]) {
    const wasValid = this.#isValid;
    const [right, isValid] = validateParsonsProblemFromUi(
      list,
      this.#problem!.exerciseSolution,
      this.autoFillRules
    );
    this.#right = right;
    this.#isValid = isValid;
    this.#feedbackVisible = this.liveFeedback || isValid;
    this.#hintVisible = false;
    this.#emit<ParsonsChangeDetail>('parsons-change', { ...this.state, isValid });
    if (isValid && !wasValid) this.#emit<ParsonsState>('parsons-solved', this.state);
  }

  #moveToSolution(id: ParsonsUiItem['id']) {
    const item = this.#left.find((i) => i.id === id);
    if (!item) return;
    this.#left = this.#left.filter((i) => i !== item);
    const right = [...this.#right];
    right.splice(Math.max(right.length - 1, 0), 0, { ...item, rule: undefined });
    this.#updateRight(right);
    this.#render(`block-${id}`);
  }

  #moveToSource(id: ParsonsUiItem['id']) {
    const item = this.#right.find((i) => i.id === id);
    if (!item || item.isStaticFirst || item.isStaticLast) return;
    this.#left = [
      ...this.#left,
      { ...item, rule: undefined, isValid: 'unknown', isValidRule: 'unknown' },
    ];
    this.#updateRight(this.#right.filter((i) => i !== item));
    this.#render(`block-${id}`);
  }

  #chooseRule(rule: string) {
    this.#closeMenus();
    const id = this.#ruleTarget;
    this.#updateRight(this.#right.map((i) => (i.id === id ? { ...i, rule } : i)));
    this.#render(this.#menuReturnKey);
  }

  #fromMenu(action: () => void) {
    this.#closeMenus();
    action();
    this.#focus(this.#menuReturnKey);
  }

  // ---- Menus (Popover API) ----------------------------------------------

  #openMenu(id: string, anchor: HTMLElement) {
    const menu = this.#view.querySelector<HTMLElement>(`#${id}`);
    if (!menu || typeof menu.showPopover !== 'function') return;
    this.#menuReturnKey = anchor.dataset.focusKey;
    menu.showPopover();
    const box = anchor.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = menu;
    const below = box.bottom + 4 + height <= innerHeight;
    menu.style.top = `${below ? box.bottom + 4 : Math.max(4, box.top - height - 4)}px`;
    menu.style.left = `${Math.max(8, Math.min(box.right - width, innerWidth - width - 8))}px`;
    menu.querySelector('button')?.focus();
  }

  #closeMenus() {
    this.#view
      .querySelectorAll<HTMLElement>('[popover]')
      .forEach((m) => m.matches?.(':popover-open') && m.hidePopover());
  }

  // ---- Rendering --------------------------------------------------------

  #status(status: ParsonsStatus): ParsonsStatus {
    if (!this.#feedbackVisible) return 'unknown';
    if (this.onlyCorrect && status !== 'green') return 'unknown';
    return status;
  }

  #activeKey(): string | undefined {
    // document.activeElement is retargeted to this host when focus is inside it.
    if (document.activeElement !== this) return undefined;
    return (this.shadowRoot?.activeElement as HTMLElement | null)?.dataset?.focusKey;
  }

  #focus(key: string | undefined) {
    if (!key) return;
    [...this.#view.querySelectorAll<HTMLElement>('[data-focus-key]')]
      .find((el) => el.dataset.focusKey === key)
      ?.focus();
  }

  #render(focusKey = this.#activeKey()) {
    const problem = this.#problem;
    if (!problem) {
      this.#view.replaceChildren();
      return;
    }
    const t = this.#t;
    const verdict = this.#isValid ? t.valid : t.invalid;

    this.#view.replaceChildren(
      h(
        'p',
        { class: 'title', part: 'title' },
        h('strong', {}, `${problem.exerciseName}: `),
        ...t.describe(problem.exerciseDescription, formula)
      ),
      this.#hintVisible ? this.#renderHint(problem, t) : '',
      h('div', { class: 'panels' }, this.#renderSource(t), this.#renderTarget(t, verdict)),
      this.#renderToolbar(t),
      this.#renderRuleMenu(t),
      this.#renderHelpMenu(t)
    );

    const announcement = this.#feedbackVisible ? verdict : '';
    if (this.#announcer.textContent !== announcement) this.#announcer.textContent = announcement;
    this.#focus(focusKey);
  }

  #renderHint(problem: ParsonsProblem, t: Messages) {
    const block = findHintBlock(problem.exerciseSolution, this.#right);
    return h(
      'p',
      { class: 'hint', part: 'hint', role: 'status' },
      ...(block ? t.hintText(formula(block.text), !this.liveFeedback) : [t.noHint])
    );
  }

  #renderBlock(item: ParsonsUiItem, where: 'source' | 'target', t: Messages) {
    const content = [h('span', { class: 'eq', 'aria-hidden': 'true' }, '⇔'), formula(item.text)];
    const status = where === 'target' ? this.#status(item.isValid) : 'unknown';
    if (where === 'target' && (item.isStaticFirst || item.isStaticLast)) {
      return h('div', { class: 'block static', part: 'block', 'data-status': status }, ...content);
    }
    return h(
      'button',
      {
        type: 'button',
        class: 'block',
        part: 'block',
        'data-status': status,
        'data-focus-key': `block-${item.id}`,
        title: where === 'source' ? t.add : t.remove,
        onclick: () =>
          where === 'source' ? this.#moveToSolution(item.id) : this.#moveToSource(item.id),
      },
      ...content
    );
  }

  #renderSource(t: Messages) {
    // Paired distractors are adjacent items with the same pairedGroupName.
    const groups: ParsonsUiItem[][] = [];
    for (const item of this.#left) {
      const last = groups.at(-1);
      if (last && item.pairedGroupName && last[0].pairedGroupName === item.pairedGroupName) {
        last.push(item);
      } else {
        groups.push([item]);
      }
    }
    return h(
      'section',
      { class: 'panel source', part: 'source', 'aria-labelledby': 'source-title' },
      h('h2', { id: 'source-title' }, t.source),
      h(
        'ul',
        { class: 'list' },
        ...groups.map((group) =>
          h(
            'li',
            { class: group.length > 1 ? 'pair' : undefined },
            group.length > 1 && h('span', { class: 'or', 'aria-hidden': 'true' }, t.or),
            ...group.map((item) => this.#renderBlock(item, 'source', t))
          )
        )
      )
    );
  }

  #renderRule(item: ParsonsUiItem, t: Messages) {
    const auto = this.autoFillRules;
    const label = item.rule ? t.rule(item.rule) : auto ? '…' : t.selectRule;
    return h(
      'button',
      {
        type: 'button',
        class: 'rule',
        part: 'rule',
        'data-status': this.#status(item.isValidRule),
        'data-focus-key': `rule-${item.id}`,
        'aria-label': `${t.ruleLabel}: ${label}`,
        'aria-haspopup': auto ? undefined : 'menu',
        disabled: auto,
        onclick: (e: Event) => {
          this.#ruleTarget = item.id;
          this.#openMenu('rule-menu', e.currentTarget as HTMLElement);
        },
      },
      label
    );
  }

  #renderTarget(t: Messages, verdict: string) {
    return h(
      'section',
      {
        class: 'panel target',
        part: 'target',
        'aria-labelledby': 'target-title',
        'data-valid': this.#feedbackVisible ? String(this.#isValid) : undefined,
      },
      h('h2', { id: 'target-title' }, this.#feedbackVisible ? verdict : t.target),
      h(
        'ol',
        { class: 'list' },
        ...this.#right.flatMap((item, index) => [
          index > 0 && h('li', { class: 'rule-row' }, this.#renderRule(item, t)),
          h('li', {}, this.#renderBlock(item, 'target', t)),
        ])
      )
    );
  }

  #renderToolbar(t: Messages) {
    return h(
      'div',
      { class: 'toolbar', part: 'toolbar' },
      !this.liveFeedback &&
        h(
          'button',
          {
            type: 'button',
            'data-focus-key': 'check',
            'aria-pressed': String(this.#feedbackVisible),
            onclick: () => {
              this.#feedbackVisible = !this.#feedbackVisible;
              this.#render();
            },
          },
          t.check
        ),
      h('button', { type: 'button', 'data-focus-key': 'reset', onclick: () => this.reset() }, t.reset),
      h(
        'button',
        {
          type: 'button',
          'data-focus-key': 'help',
          'aria-haspopup': 'menu',
          onclick: (e: Event) => this.#openMenu('help-menu', e.currentTarget as HTMLElement),
        },
        `${t.help} ▾`
      )
    );
  }

  #renderRuleMenu(t: Messages) {
    return h(
      'div',
      { id: 'rule-menu', class: 'menu rules', popover: 'auto', role: 'menu', 'aria-label': t.ruleLabel },
      ...rules.map((rule) =>
        h(
          'button',
          { type: 'button', role: 'menuitem', 'data-rule': rule, onclick: () => this.#chooseRule(rule) },
          t.rule(rule)
        )
      )
    );
  }

  #renderHelpMenu(t: Messages) {
    const item = (label: string, action: () => void) =>
      h('button', { type: 'button', role: 'menuitem', onclick: () => this.#fromMenu(action) }, label);
    return h(
      'div',
      { id: 'help-menu', class: 'menu', popover: 'auto', role: 'menu', 'aria-label': t.help },
      item(t.hint, () => this.hint()),
      item(t.step, () => this.completeStep()),
      item(t.solve, () => this.solve())
    );
  }
}
