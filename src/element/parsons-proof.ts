// <parsons-proof>: a Parsons problem for logical equivalence proofs as a
// native Web Component. No runtime dependencies; the domain logic lives in
// ../core and this file only owns state, rendering and events.
//
// Attributes: live-feedback, only-correct, auto-fill-rules, no-distractors, lang
// Properties: exercise (LogEx oneFinal response), problem, settings, state, isValid
// Methods:    check(), hint(), completeStep(), showSolution(), solve(), reset()
// Events:     parsons-change, parsons-solved, parsons-help
//
// Blocks move by drag and drop (Pointer Events, see ./drag), by click (add to
// the solution / move back) and by keyboard (Alt+Arrow keys reorder the
// solution, Arrow keys move focus). Moves animate with FLIP via the Web
// Animations API unless the user prefers reduced motion.
import css from './styles.css?inline';
import { completeExercise, completeStep, findHintBlock } from '../core/help';
import { moveBlock, Panel } from '../core/moves';
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
import { Drop, enableDrag } from './drag';
import { Messages, messagesFor } from './i18n';

export type ParsonsChangeDetail = ParsonsState & { isValid: boolean };
export type ParsonsHelpDetail = { kind: 'hint' | 'step' | 'show-solution' | 'solve' };

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
  #announcement = '';
  #flipFrom?: { key: string; rect: DOMRect };
  #dialog?: HTMLDialogElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    applyStyles(root);
    this.#view = h('div', { part: 'root' });
    this.#announcer = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    root.append(this.#view, this.#announcer);
    enableDrag(this.#view, (drop) => this.#onDrop(drop));
    this.#view.addEventListener('keydown', (e) => this.#onKeyDown(e));
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

  /** Show the complete solution in a modal dialog, without changing the learner's work. */
  showSolution() {
    const problem = this.#problem;
    if (!problem) return;
    const t = this.#t;
    const dialog = (this.#dialog ??= this.#createDialog());
    dialog.setAttribute('aria-label', t.solutionTitle(problem.exerciseName));
    dialog.replaceChildren(
      h(
        'div',
        { class: 'dialog-body' },
        h(
          'form',
          { method: 'dialog', class: 'dialog-header' },
          h('h2', {}, t.solutionTitle(problem.exerciseName)),
          h('button', { class: 'close', 'aria-label': t.close, title: t.close, autofocus: true }, '✕')
        ),
        h(
          'ol',
          { class: 'list solution' },
          ...problem.exerciseSolution.map((step, index) =>
            step.type === 'block'
              ? h(
                  'li',
                  {},
                  h(
                    'div',
                    { class: 'block static', 'data-status': 'unknown' },
                    h('span', { class: 'eq', 'aria-hidden': 'true' }, index === 0 ? '' : '⇔'),
                    formula(step.text)
                  )
                )
              : h('li', { class: 'rule-row' }, h('div', { class: 'rule' }, t.rule(step.text)))
          )
        )
      )
    );
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else dialog.setAttribute('open', '');
    this.#emit<ParsonsHelpDetail>('parsons-help', { kind: 'show-solution' });
  }

  #createDialog() {
    const dialog = h('dialog', { class: 'solution-dialog', part: 'dialog', closedby: 'any' });
    // Light dismiss for browsers without closedby: a click on the backdrop
    // targets the dialog itself, as all content sits in .dialog-body.
    dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
    dialog.addEventListener('close', () => this.#focus('help'));
    this.shadowRoot!.append(dialog);
    return dialog;
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

  #findId(key: string): ParsonsUiItem['id'] | undefined {
    return [...this.#left, ...this.#right].find((i) => String(i.id) === key)?.id;
  }

  #move(id: ParsonsUiItem['id'], to: Panel, index?: number, focusKey?: string) {
    const item = [...this.#left, ...this.#right].find((i) => i.id === id);
    // Order in the problem panel carries no meaning: dropping there is a no-op.
    if (!item || (to === 'left' && this.#left.includes(item))) return;
    const next = moveBlock(this.state, id, to, index);
    const same = (a: ParsonsUiItem[], b: ParsonsUiItem[]) =>
      a.length === b.length && a.every((x, i) => x.id === b[i].id);
    if (same(next.left, this.#left) && same(next.right, this.#right)) return;
    this.#left = next.left;
    this.#updateRight(next.right);

    const t = this.#t;
    const position = this.#right.findIndex((i) => i.id === id);
    this.#announcement =
      to === 'right'
        ? t.movedTo(item.text, position + 1, this.#right.length)
        : t.movedBack(item.text);
    this.#render(focusKey);
  }

  #onDrop({ id: key, to, index, from }: Drop) {
    const id = this.#findId(key);
    if (id === undefined) return;
    this.#flipFrom = { key: `block-${key}`, rect: from };
    this.#move(id, to, index);
  }

  #onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const el = (e.target as Element).closest?.<HTMLElement>('button.block[data-id]');
    if (!el) return;
    e.preventDefault();
    const step = e.key === 'ArrowUp' ? -1 : 1;
    const id = this.#findId(el.dataset.id!);
    const index = this.#right.findIndex((i) => i.id === id);

    if (e.altKey && el.dataset.list === 'right' && id !== undefined) {
      this.#move(id, 'right', index + step, el.dataset.focusKey);
      return;
    }
    const list = el.closest('.list');
    const blocks = [...(list?.querySelectorAll<HTMLElement>('button.block') ?? [])];
    blocks[blocks.indexOf(el) + step]?.focus();
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
    const before = this.#positions();

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

    const announcement = [this.#announcement, this.#feedbackVisible ? verdict : '']
      .filter(Boolean)
      .join(' ');
    this.#announcement = '';
    if (this.#announcer.textContent !== announcement) this.#announcer.textContent = announcement;
    this.#focus(focusKey);
    this.#animateFrom(before);
  }

  /** Block positions before a render, keyed by data-key (for FLIP). */
  #positions(): Map<string, DOMRect> {
    const positions = new Map(
      [...this.#view.querySelectorAll<HTMLElement>('.block[data-key]')].map((b) => [
        b.dataset.key!,
        b.getBoundingClientRect(),
      ])
    );
    if (this.#flipFrom) positions.set(this.#flipFrom.key, this.#flipFrom.rect);
    this.#flipFrom = undefined;
    return positions;
  }

  #animateFrom(before: Map<string, DOMRect>) {
    if (before.size === 0 || matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    for (const block of this.#view.querySelectorAll<HTMLElement>('.block[data-key]')) {
      const from = before.get(block.dataset.key!);
      if (!from || typeof block.animate !== 'function') continue;
      const to = block.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      block.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 200, easing: 'ease-out' }
      );
    }
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
    const key = `block-${item.id}`;
    if (where === 'target' && (item.isStaticFirst || item.isStaticLast)) {
      return h(
        'div',
        { class: 'block static', part: 'block', 'data-status': status, 'data-key': key },
        ...content
      );
    }
    return h(
      'button',
      {
        type: 'button',
        class: 'block',
        part: 'block',
        'data-status': status,
        'data-key': key,
        'data-focus-key': key,
        'data-id': String(item.id),
        'data-list': where === 'source' ? 'left' : 'right',
        title: where === 'source' ? t.add : t.remove,
        'aria-keyshortcuts': where === 'target' ? 'Alt+ArrowUp Alt+ArrowDown' : undefined,
        onclick: () =>
          where === 'source'
            ? this.#move(item.id, 'right', undefined, key)
            : this.#move(item.id, 'left', undefined, key),
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
      item(t.showSolution, () => this.showSolution()),
      item(t.solve, () => this.solve())
    );
  }
}
