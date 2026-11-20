import { ValidatedParsonsItem, ParsonsItem, ParsonsUiItem, ParsonsStatus, WithText } from './types.js';
interface AddToArrayFn<Type> {
    (arr: Type[], item: Type): Type[];
}
type ParsonsBlockValidator<T, T2> = {
    type: 'reduce' | 'reduceRight';
    addToArray: AddToArrayFn<T2>;
    getMatchingSolutionItem: (arr: T[], currentIndex: number, length: number) => T | undefined;
};
type ParsonsValidateFunc<T, T2> = (toValidate: T[], solution: T[], validator: ParsonsBlockValidator<T, T2>, autoFillRewriteRules: boolean) => T2[];
export declare const validateParsonsProblemFromUi: (toValidate: ParsonsUiItem[], solution: ParsonsItem[], autoFillRewriteRules: boolean) => [ParsonsUiItem[], boolean];
export declare const validateParsonsProblem: (toValidate: ParsonsItem[], solution: ParsonsItem[], autoFillRewriteRules?: boolean) => [ValidatedParsonsItem[], boolean];
export declare const executeValidator: ParsonsValidateFunc<ParsonsItem, ValidatedParsonsItem>;
export declare const combineStatus: (tuple: [ParsonsStatus, ParsonsStatus]) => ParsonsStatus;
export declare const getParsonsValidatorDown: () => ParsonsBlockValidator<ParsonsItem, ValidatedParsonsItem>;
export declare const getParsonsValidatorUp: () => ParsonsBlockValidator<ParsonsItem, ValidatedParsonsItem>;
export declare const getItemByIndex: <T>(arr: T[], index: number) => T | undefined;
export declare const getMatchingItemFromEnd: <T>(arr: T[], index: number, length: number) => T | undefined;
export declare const isItemValid: (learnersItem: WithText, validItem: WithText) => ParsonsStatus;
export declare const addArrayToEnd: <T>(arr: T[], item: T) => T[];
export declare const addArrayToStart: <T>(arr: T[], item: T) => T[];
export declare const countNumberOfItemsValid: (list: ParsonsUiItem[], direction: 'downwards' | 'upwards') => number;
export {};
