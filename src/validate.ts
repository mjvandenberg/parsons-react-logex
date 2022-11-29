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

type reducerType = 'reduce' | 'reduceRight';
type validationOrder = {
  type: reducerType;
  getPreviousItem: (
    solutionToValidate: ParsonsItem[],
    currentIndex: number
  ) => ParsonsItem;
  addToArray: AddToArrayFn<ParsonsItem>;
  getValidItem: (
    solutionToValidate: ParsonsItem[],
    currentIndex: number,
    validSolution: ParsonsSolutionItem[]
  ) => ParsonsSolutionItem;
};
const validationOrders: validationOrder[] = [
  {
    type: 'reduce',
    getPreviousItem: (solutionToValidate, currentIndex) =>
      solutionToValidate[currentIndex - 1],
    addToArray: addArrayToEnd,
    getValidItem: (_, currentIndex, validSolution) =>
      validSolution[currentIndex],
  },
  {
    type: 'reduceRight',
    getPreviousItem: (solutionToValidate, currentIndex) =>
      solutionToValidate[0],
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
    reduceOrder: validationOrder
  ) => ParsonsItem[] = (
    solutionToValidate,
    { type, getPreviousItem, addToArray, getValidItem }
  ) =>
    solutionToValidate[type]<ParsonsItem[]>(
      (accumulator, currentValue, currentIndex) => {
        const validItem = getValidItem(
          solutionToValidate,
          currentIndex,
          validSolution
        );

        const previousItem = getPreviousItem(accumulator, currentIndex);

        return addToArray(accumulator, {
          ...currentValue,
          isValid: currentValue.isValid
            ? true
            : currentValue.isValid === false
            ? false
            : previousItem === undefined ||
              (currentIndex < validSolution.length &&
                previousItem.isValid === true)
            ? validItem.text === currentValue.text &&
              validItem.rule === currentValue.rule
            : undefined,
        });
      },
      []
    );

  const list = validationOrders.reduce<ParsonsItem[]>(
    (accumulator, currentValue) => {
      return reducer(accumulator, currentValue);
    },
    solutionToValidate.map((i) => {
      return { ...i, isValid: undefined };
    })
  );

  const isValid =
    list.length === validSolution.length && list.every((i) => i.isValid);

  return [list, isValid];
};
