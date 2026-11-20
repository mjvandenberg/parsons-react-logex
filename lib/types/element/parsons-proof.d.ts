import { OneFinalResponse } from '../core/logex/typesOneFinal.js';
import { ParsonsProblem, ParsonsState, Settings } from '../core/types.js';
/** Detail of `parsons-change`: both panels after the change, and whether the solution is valid. */
export type ParsonsChangeDetail = ParsonsState & {
    isValid: boolean;
};
/** Detail of `parsons-help`: which help option the learner used. */
export type ParsonsHelpDetail = {
    kind: 'hint' | 'step' | 'show-solution' | 'solve';
};
/**
 * `<parsons-proof>`: a Parsons problem for logical equivalence proofs.
 *
 * @attr live-feedback - show feedback after every change
 * @attr only-correct - mark only correct items
 * @attr auto-fill-rules - fill in rewrite rules between correctly placed formulas
 * @attr no-distractors - leave out distractor blocks
 * @attr lang - language (`en`, `nl`); inherited from the nearest `lang` attribute
 * @fires parsons-change - after every change to the solution ({@link ParsonsChangeDetail})
 * @fires parsons-solved - when the solution becomes valid ({@link ParsonsState})
 * @fires parsons-help - when a help option is used ({@link ParsonsHelpDetail})
 * @csspart title, hint, source, target, block, rule, toolbar, dialog
 */
export declare class ParsonsProof extends HTMLElement {
    #private;
    static observedAttributes: string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void;
    /** A LogEx `onefinal` response; converted to a problem and shuffled on every reset. */
    get exercise(): OneFinalResponse | undefined;
    set exercise(response: OneFinalResponse | undefined);
    /** A ready-made problem (no reshuffle on reset). */
    get problem(): ParsonsProblem | undefined;
    set problem(problem: ParsonsProblem | undefined);
    /** Attribute `live-feedback`: show feedback after every change instead of on "Check solution". */
    get liveFeedback(): boolean;
    set liveFeedback(on: boolean);
    /** Attribute `only-correct`: mark only correct items (green), never incorrect ones. */
    get onlyCorrect(): boolean;
    set onlyCorrect(on: boolean);
    /** Attribute `auto-fill-rules`: fill in the rewrite rule between two correctly placed formulas. */
    get autoFillRules(): boolean;
    set autoFillRules(on: boolean);
    /** The prototype's settings object, mapped onto the attributes. */
    get settings(): Settings;
    set settings(s: Settings);
    /** A copy of both panels: `left` is the problem panel, `right` the solution. */
    get state(): ParsonsState;
    /** Whether the solution panel holds a complete, correct proof. */
    get isValid(): boolean;
    /** Show feedback on the current solution; returns whether it is valid. */
    check(): boolean;
    /** Help option "Hint": suggest the next formula to use. Fires `parsons-help`. */
    hint(): void;
    /**
     * Help option "Complete one step": move a distractor out of the solution,
     * or add one correct formula. Fires `parsons-help`.
     */
    completeStep(): void;
    /** Show the complete solution in a modal dialog, without changing the learner's work. */
    showSolution(): void;
    /** Help option "Complete my exercise": put the full solution in place. Fires `parsons-help`. */
    solve(): void;
    /** Start the exercise over; an `exercise` is shuffled again. */
    reset(): void;
}
