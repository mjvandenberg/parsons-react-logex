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

/**
 * Validates if a parsons problem solution is valid according to the valid solution
 * Returns the solution with feedback for the student in the isValid property and
 * a boolean indicating if the solution is valid.
 */
export const validateParsonsProblem: (
  solutionToValidate: ParsonsItem[],
  validSolution: ParsonsSolutionItem[]
) => [ParsonsItem[], boolean] = (solutionToValidate, validSolution) => {
  //reduce -> -1 or reduceRight -> +1
  type reducers = 'reduce' | 'reduceRight';
  type reducerOrder = {
    type: reducers;
    previousItem: number;
    firstItemIndex: number;
    addToArray: AddToArrayFn<ParsonsItem>;
  };
  const orders: reducerOrder[] = [
    {
      type: 'reduce',
      previousItem: -1,
      firstItemIndex: 0,
      addToArray: addArrayToEnd,
    },
    {
      type: 'reduceRight',
      previousItem: 1,
      firstItemIndex: solutionToValidate.length - 1,
      addToArray: addArrayToStart,
    },
  ];

  const reducer: (reduceOrder: reducerOrder) => ParsonsItem[] = ({
    type,
    firstItemIndex,
    previousItem,
    addToArray,
  }) =>
    solutionToValidate[type]<ParsonsItem[]>(
      (accumulator, currentValue, currentIndex) =>
        addToArray(accumulator, {
          ...currentValue,
          isValid:
            currentIndex === firstItemIndex ||
            (currentIndex < validSolution.length &&
              accumulator[accumulator.length + previousItem].isValid === true)
              ? validSolution[currentIndex].text === currentValue.text &&
                validSolution[currentIndex].rule === currentValue.rule
              : accumulator[accumulator.length + previousItem].isValid === true
              ? false
              : undefined,
        }),
      []
    );
  const list = reducer(orders[0]);
  const isValid =
    list.length === validSolution.length && list.every((i) => i.isValid);

  return [list, isValid];
};
