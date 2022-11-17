import { ParsonsItem, ParsonsSolutionItem } from './types';

/**
 * Validates if a parsons problem solution is valid according to the valid solution
 * Returns the solution with feedback for the student in the isValid property and
 * a boolean indicating if the solution is valid.
 */
export const validateParsonsProblem: (
  solutionToValidate: ParsonsItem[],
  validSolution: ParsonsSolutionItem[]
) => [ParsonsItem[], boolean] = (solutionToValidate, validSolution) => {
  const newList = solutionToValidate.reduce<ParsonsItem[]>(
    (accumulator, currentValue, currentIndex) => [
      ...accumulator,
      {
        ...currentValue,
        isValid:
          currentIndex === 0 ||
          (currentIndex < validSolution.length &&
            accumulator[accumulator.length - 1].isValid === true)
            ? validSolution[currentIndex].text === currentValue.text &&
              validSolution[currentIndex].rule === currentValue.rule
            : accumulator[accumulator.length - 1].isValid === true
            ? false
            : undefined,
      },
    ],
    []
  );
  const newIsValid =
    newList.length === validSolution.length &&
    !newList.some((i) => i.isValid === undefined || i.isValid === false);

  return [newList, newIsValid];
};
