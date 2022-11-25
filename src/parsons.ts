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
    previousItem: (
      solutionToValidate: ParsonsItem[],
      currentIndex: number,
      validSolution: ParsonsSolutionItem[]
    ) => ParsonsItem;
    firstItemIndex: number;
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
      previousItem: (solutionToValidate, currentIndex, validSolution) =>
        solutionToValidate[0],
      firstItemIndex: 0,
      addToArray: addArrayToEnd,
      getValidItem: (solutionToValidate, currentIndex, validSolution) =>
        validSolution[currentIndex],
    },
    {
      type: 'reduceRight',
      previousItem: (solutionToValidate, currentIndex, validSolution) =>
        solutionToValidate[0],
      firstItemIndex: solutionToValidate.length - 1,
      addToArray: addArrayToStart,
      getValidItem: (solutionToValidate, currentIndex, validSolution) =>
        validSolution[
          validSolution.length - (solutionToValidate.length - currentIndex)
        ],
    },
  ];

  const reducer: (reduceOrder: reducerOrder) => ParsonsItem[] = ({
    type,
    firstItemIndex,
    previousItem,
    addToArray,
    getValidItem,
  }) =>
    solutionToValidate[type]<ParsonsItem[]>(
      (accumulator, currentValue, currentIndex) => {
        const validItem = getValidItem(
          solutionToValidate,
          currentIndex,
          validSolution
        );
        console.info(`validItem index ${currentIndex}`, validItem);
        return addToArray(accumulator, {
          ...currentValue,
          isValid:
            'isValid' in currentValue && currentValue.isValid
              ? true
              : currentIndex === firstItemIndex ||
                (currentIndex < validSolution.length &&
                  previousItem(accumulator, currentIndex, validSolution)
                    .isValid === true)
              ? validItem.text === currentValue.text &&
                validItem.rule === currentValue.rule
              : previousItem(accumulator, currentIndex, validSolution)
                  .isValid === true
              ? false
              : undefined,
        });
      },
      []
    );
  const list = reducer(orders[1]);
  const isValid =
    list.length === validSolution.length && list.every((i) => i.isValid);

  return [list, isValid];
};
