import { ValidatedParsonsItem, ParsonsItem, ParsonsUiItem, ParsonsSolutionItem, ParsonsStatus, WithText, r } from './types';

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

/*type validationOrder = {
  type: reducerType;
  getPreviousItem: (
    solutionToValidate: ParsonsItemOld[],
    currentIndex: number
  ) => ParsonsItemOld;
  addToArray: AddToArrayFn<ParsonsItemOld>;
  getValidItem: (
    solutionToValidate: ParsonsItemOld[],
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

/*
 * Validates if a parsons problem solution is valid according to the valid solution
 * Returns the solution with feedback for the student in the isValid property and
 * a boolean indicating if the solution is valid.
 
export const validateParsonsProblem: (
  solutionToValidate: ParsonsItemOld[],
  validSolution: ParsonsSolutionItem[]
) => [ParsonsItemOld[], boolean] = (solutionToValidate, validSolution) => {
  const reducer: (
    solutionToValidate: ParsonsItemOld[],
    reduceOrder: validationOrder
  ) => ParsonsItemOld[] = (
    solutionToValidate,
    { type, getPreviousItem, addToArray, getValidItem }
  ) =>
      solutionToValidate[type]<ParsonsItemOld[]>(
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
                  ? validItem.text === currentValue.text
                  : undefined,
          });
        },
        []
      );

  const list = validationOrders.reduce<ParsonsItemOld[]>(
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
};*/

//////

export const ConvertUiItemToItem
  : (from: ParsonsUiItem[]) => ParsonsItem[]
  = (from) => from
    .reduce<ParsonsItem[]>((acc, curr, index) => index === 0
      ? [{ text: curr.text, type: "block" }]
      : [
        ...acc,
        { text: (curr.rule) ? curr.rule : "", type: "rule" },
        { text: curr.text, type: "block" }
      ]
      , []);

export const ConvertItemToUiItem
  : (source: ParsonsUiItem[], validated: ValidatedParsonsItem[]) => ParsonsUiItem[]
  = (source, validated) => source.map<ParsonsUiItem>((i, x) => {
    return { ...i, isValid: ConertStatusToBoolean(validated[x * 2].status) }
  });

const ConertStatusToBoolean
  : (input: ParsonsStatus) => boolean | undefined
  = (input) => {
    if (input === "green") {
      return true;
    }
    if (input === "yellow") {
      return true;
    }
    if (input === "red") {
      return false;
    }
    return undefined;
  }

type ParsonsBlockValidator<T, T2> = {
  type: reducerType;
  getPreviousItem: (
    solutionToValidate: T2[],
    currentIndex: number
  ) => T2 | undefined;
  addToArray: AddToArrayFn<T2>;
  getMatchingSolutionBlock: (
    arr: T[],
    currentIndex: number,
    length: number,
  ) => T | undefined;
};

type ParsonsValidateFunc<T, T2> = (toValidate: T[], solution: T[], validator: ParsonsBlockValidator<T, T2>) => T2[];

export const validateParsonsProblem2: (
  learners: ParsonsItem[],
  solution: ParsonsItem[]
) => [ValidatedParsonsItem[], boolean] = (learners, solution) => {

  // TODO: VALIDATIE solutionToValidate
  // 1: valideren dat als index even is het item altijd een block is
  // 2: valideren dat als index oneven is het item altijd een rule is
  // 3: valideren dat length altijd oneven is

  const validators = [
    getParsonsBlockValidatorDown(),
    getParsonsBlockValidatorUp()
  ];

  const result = validators
    .map(validator => executeValidator(learners, solution, validator))
    .reduce<ValidatedParsonsItem[]>((acc, curr, index) =>
      index === 0 ? curr : combineValidatorResults(acc, curr)
      , []);

  return [result, true];
}

const combineValidatorResults
  : (a: ValidatedParsonsItem[], b: ValidatedParsonsItem[]) => ValidatedParsonsItem[]
  = (a, b) => a.map<ValidatedParsonsItem>((i, x) => { return { ...i, status: combineStatus([i.status, b[x].status]) } })

export const combineStatus
  : (tuple: [ParsonsStatus, ParsonsStatus]) => ParsonsStatus
  = (tuple) => {
    if (ifAreSame(tuple)) {
      return tuple[0];
    } else if (ifCombinationIs(tuple, ["unknown", "green"])) {
      return "green"
    } else if (ifCombinationIs(tuple, ["unknown", "red"])) {
      return "red"
    } else if (ifCombinationIs(tuple, ["green", "red"])) {
      return "yellow"
    }
    throw new Error();
  }

const ifAreSame
  : <T>(tuple: [T, T]) => boolean
  = ([a, b]) => ifCombinationIs([a, b], [a, a])

const ifCombinationIs
  : <T>(tuple: [T, T], tuple2: [T, T]) => boolean
  = ([a, b], [c, d]) => ((a == c && b == d) || (a == d && b == c))

export const getParsonsBlockValidatorDown
  : () => ParsonsBlockValidator<ParsonsItem, ValidatedParsonsItem>
  = () => {
    return {
      type: "reduce",
      addToArray: addArrayToEnd,
      getPreviousItem: getPreviousItemReduce,
      getMatchingSolutionBlock: (arr, i, _) => getItemByIndex(arr, i),
    }
  };

export const getParsonsBlockValidatorUp
  : () => ParsonsBlockValidator<ParsonsItem, ValidatedParsonsItem>
  = () => {
    return {
      type: "reduceRight",
      addToArray: addArrayToStart,
      getPreviousItem: getPreviousItemReduceRight,
      getMatchingSolutionBlock: getMatchingItemFromEnd,
    }
  };

export const getPreviousItemReduce
  : <T>(arr: T[], index: number) => T | undefined
  = (arr, index) => index - 2 >= 0 && arr.length < index + 2 ? arr[index - 2] : undefined;

export const getPreviousItemReduceRight
  : <T>(arr: T[], index: number) => T | undefined
  = (arr, index) => arr[1];

export const getItemByIndex
  : <T>(arr: T[], index: number) => T | undefined
  = (arr, index) => arr.length > index ? arr[index] : undefined;

export const getMatchingItemFromEnd
  : <T>(arr: T[], index: number, length: number) => T | undefined
  = (arr, index, length) => {
    return arr[index + (arr.length - length)];
  }

export const isItemValid
  : (learnersItem: WithText, validItem: WithText) => ParsonsStatus
  = (learnersItem, validItem) => learnersItem.text === validItem.text ? "green" : "red";

export const executeValidator
  : ParsonsValidateFunc<ParsonsItem, ValidatedParsonsItem>
  = (toValidate, solution, validator) => {
    let stop = false;

    return toValidate[validator.type]<ValidatedParsonsItem[]>((acc, curr, index) => {

      if (stop || curr.type === r) {
        return validator.addToArray(acc, { ...curr, status: "unknown" });
      }

      const matchingSolutionBlock = validator.getMatchingSolutionBlock(solution, index, toValidate.length);

      let status: ParsonsStatus = "unknown";

      if (!matchingSolutionBlock) {
        status = "red";
      }
      else {
        const prev = validator.getPreviousItem(acc, index);
        if (!prev) {
          status = isItemValid(curr, matchingSolutionBlock);
        } else if (prev.status === "unknown") {
          status = "unknown";
        } else {
          status = isItemValid(curr, matchingSolutionBlock);
        }
      }

      if (status === "red") {
        stop = true;
      }

      return validator.addToArray(acc, { ...curr, status });

    }, []);
  }
