import { ParsonsItem, ParsonsSolutionItem } from './types';

interface AddToArrayFn<Type> {
  (arr: Type[], item: Type): Type[];
}

function addArrayToEnd<T>(arr: T[], item: T) {
  return [...arr, item];
}

function addArrayToStart<T>(arr: T[], item: T) {
  return [item, ...arr];
}

type reducers = 'reduce' | 'reduceRight';
type reducerOrder = {
  type: reducers;
  getPreviousItem: (solutionToValidate: ParsonsItem[]) => ParsonsItem;
  getFirstItemIndex: (solutionToValidate: ParsonsItem[]) => number;
  addToArray: AddToArrayFn<ParsonsItem>;
  getValidItem: (
    solutionToValidate: ParsonsItem[],
    currentIndex: number,
    validSolution: ParsonsSolutionItem[]
  ) => ParsonsSolutionItem;
};
const orders: reducerOrder[] = [
  {
    type: 'reduce',
    getPreviousItem: (solutionToValidate) => solutionToValidate[0],
    getFirstItemIndex: (_) => 0,
    addToArray: addArrayToEnd,
    getValidItem: (_, currentIndex, validSolution) =>
      validSolution[currentIndex],
  },
  {
    type: 'reduceRight',
    getPreviousItem: (solutionToValidate) =>
      solutionToValidate[solutionToValidate.length - 1],
    getFirstItemIndex: (solutionToValidate) => solutionToValidate.length - 1,
    addToArray: addArrayToStart,
    getValidItem: (solutionToValidate, currentIndex, validSolution) =>
      validSolution[
        validSolution.length - (solutionToValidate.length - currentIndex)
      ],
  },
];

/**
 * Validates if a parsons problem solution is valid according to the valid solution
 * Returns the solution with feedback for the student in the isValid property and
 * a boolean indicating if the solution is valid.
 */
export const validateParsonsProblem: (
  solutionToValidate: ParsonsItem[],
  validSolution: ParsonsSolutionItem[]
) => [ParsonsItem[], boolean] = (solutionToValidate, validSolution) => {
  const reducer: (
    solutionToValidate: ParsonsItem[],
    reduceOrder: reducerOrder
  ) => ParsonsItem[] = (
    solutionToValidate,
    { type, getFirstItemIndex, getPreviousItem, addToArray, getValidItem }
  ) =>
    solutionToValidate[type]<ParsonsItem[]>(
      (accumulator, currentValue, currentIndex) => {
        const validItem = getValidItem(
          solutionToValidate,
          currentIndex,
          validSolution
        );
        const previousItem = getPreviousItem(accumulator);
        const firstItemIndex = getFirstItemIndex(solutionToValidate);
        return addToArray(accumulator, {
          ...currentValue,
          isValid: currentValue.isValid
            ? true
            : currentIndex === firstItemIndex ||
              (currentIndex < validSolution.length &&
                previousItem.isValid === true)
            ? validItem.text === currentValue.text &&
              validItem.rule === currentValue.rule
            : previousItem.isValid === true
            ? false
            : undefined,
        });
      },
      []
    );
  //const list = reducer(solutionToValidate, orders[1]);
  const list = orders.reduce((accumulator, currentValue) => {
    return reducer(accumulator, currentValue);
  }, solutionToValidate);

  const isValid =
    list.length === validSolution.length && list.every((i) => i.isValid);

  return [list, isValid];
};
