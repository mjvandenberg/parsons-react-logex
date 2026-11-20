export declare const languages: readonly ['nl', 'en'];
export type Language = typeof languages[number];
declare const status: readonly ['green', 'red', 'unknown'];
export type ParsonsStatus = typeof status[number];
type Block = 'block';
type Rule = 'rule';
export type WithText = {
    text: string;
};
type WithStatus = {
    status: ParsonsStatus;
};
/** One entry of a derivation: a formula block or the rewrite rule between two blocks. */
export type ParsonsItem = {
    text: string;
    type: Block | Rule;
};
export type ValidatedParsonsItem = ParsonsItem & WithStatus;
/**
 * A formula block as it lives in one of the two panels.
 * `rule` is the rewrite rule that connects this block to the block above it.
 * (A type alias rather than an interface, so drag-and-drop libraries that
 * expect an index signature accept it structurally.)
 */
export type ParsonsUiItem = {
    id: string | number;
    text: string;
    rule?: string;
    isStaticFirst?: boolean;
    isStaticLast?: boolean;
    pairedGroupName?: string;
    isValid: ParsonsStatus;
    isValidRule: ParsonsStatus;
};
/** Contents of both panels: the problem panel (left) and the solution panel (right). */
export type ParsonsState = {
    left: ParsonsUiItem[];
    right: ParsonsUiItem[];
};
export type ExerciseType = 'equivalence' | 'dnv' | 'cnv';
/** What the learner is asked to do, as data; the UI decides how to render it. */
export type ExerciseDescription = {
    type: ExerciseType;
    from: string;
    to: string;
};
export interface ParsonsProblem {
    exerciseName: string;
    exerciseDescription: ExerciseDescription;
    exerciseSolution: ParsonsItem[];
    listLeft: ParsonsUiItem[];
    listRight: ParsonsUiItem[];
}
export interface Settings {
    instantFeedback: boolean;
    markInvalidItems: boolean;
    autoFillRewriteRules: boolean;
}
export {};
