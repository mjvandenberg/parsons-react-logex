import {
  ValidatedParsonsItem,
  ParsonsItem,
  ParsonsUiItem,
  ParsonsStatus,
  WithText,
} from './types';

interface AddToArrayFn<Type> {
  (arr: Type[], item: Type): Type[];
}

type ParsonsBlockValidator<T, T2> = {
  type: 'reduce' | 'reduceRight';
  addToArray: AddToArrayFn<T2>;
  getMatchingSolutionBlock: (
    arr: T[],
    currentIndex: number,
    length: number
  ) => T | undefined;
};

type ParsonsValidateFunc<T, T2> = (
  toValidate: T[],
  solution: T[],
  validator: ParsonsBlockValidator<T, T2>
) => T2[];

export const validateParsonsProblemFromUi: (
  toValidate: ParsonsUiItem[],
  solution: ParsonsItem[],
  autoFillRewriteRules: boolean
) => [ParsonsUiItem[], boolean] = (
  toValidate,
  solution,
  autoFillRewriteRules
) => {
  const [validatedResult, isValid] = validateParsonsProblem(
    ConvertUiItemToItem(toValidate),
    solution,
    autoFillRewriteRules
  );
  return [ConvertItemToUiItem(toValidate, validatedResult), isValid];
};

export const validateParsonsProblem: (
  toValidate: ParsonsItem[],
  solution: ParsonsItem[],
  autoFillRewriteRules: boolean
) => [ValidatedParsonsItem[], boolean] = (
  toValidate,
  solution,
  autoFillRewriteRules
) => {
  if (toValidate.length % 2 === 0)
    throw new Error(
      'the solution to validate should have an odd number of items'
    );
  toValidate.forEach((item, index) => {
    if (index % 2 == 0 && item.type === 'rule') {
      throw Error('even items always should be of type block');
    } else if (index % 2 == 1 && item.type === 'block') {
      throw Error('odd items always should be of type rule');
    }
  });

  const validators = [
    getParsonsBlockValidatorDown(),
    getParsonsBlockValidatorUp(),
  ];

  const result = validators
    .map((validator) => executeValidator(toValidate, solution, validator))
    .reduce<ValidatedParsonsItem[]>(
      (acc, curr, index) =>
        index === 0 ? curr : combineValidatorResults(acc, curr),
      []
    )
    .map<ValidatedParsonsItem>((item, i, arr) =>
      item.type === 'block'
        ? item
        : ifBothBlocksValid(arr[i - 1].status, arr[i + 1].status)
        ? {
            ...item,
            status:
              autoFillRewriteRules ||
              getCorrespondingRewriteRuleFromSolution(
                solution,
                arr[i - 1].text,
                arr[i + 1].text
              ) === item.text
                ? 'green'
                : 'red',
            text: autoFillRewriteRules
              ? getCorrespondingRewriteRuleFromSolution(
                  solution,
                  arr[i - 1].text,
                  arr[i + 1].text
                )
              : item.text,
          }
        : { ...item, text: autoFillRewriteRules ? '' : item.text }
    );

  const isValid = !result.some((i) => i.status !== 'green');

  return [result, isValid];
};

const getCorrespondingRewriteRuleFromSolution: (
  solution: ParsonsItem[],
  textAbove: string,
  textBelow: string
) => string = (solution, textAbove, textBelow) => {
  let result: string = '';

  for (let x = 0; x < solution.length; x++) {
    if (solution[x].type != 'rule') {
      continue;
    }
    if (
      solution[x - 1].text === textAbove &&
      solution[x + 1].text === textBelow
    ) {
      return solution[x].text;
    }
  }

  throw Error();
};

export const executeValidator: ParsonsValidateFunc<
  ParsonsItem,
  ValidatedParsonsItem
> = (toValidate, solution, validator) => {
  let stop = false;

  return toValidate[validator.type]<ValidatedParsonsItem[]>(
    (acc, curr, index) => {
      if (stop || curr.type === 'rule') {
        return validator.addToArray(acc, { ...curr, status: 'unknown' });
      }

      const matchingSolutionBlock = validator.getMatchingSolutionBlock(
        solution,
        index,
        toValidate.length
      );

      let status: ParsonsStatus = 'unknown';

      if (!matchingSolutionBlock) {
        status = 'red';
      } else {
        status = isItemValid(curr, matchingSolutionBlock);
      }

      if (status === 'red') {
        stop = true;
      }

      return validator.addToArray(acc, { ...curr, status });
    },
    []
  );
};

const ConvertUiItemToItem: (from: ParsonsUiItem[]) => ParsonsItem[] = (from) =>
  from.reduce<ParsonsItem[]>(
    (acc, curr, index) =>
      index === 0
        ? [{ text: curr.text, type: 'block' }]
        : [
            ...acc,
            { text: curr.rule ? curr.rule : '', type: 'rule' },
            { text: curr.text, type: 'block' },
          ],
    []
  );

const ConvertItemToUiItem: (
  source: ParsonsUiItem[],
  validated: ValidatedParsonsItem[]
) => ParsonsUiItem[] = (source, validated) =>
  source.map<ParsonsUiItem>((i, x) => {
    return {
      ...i,
      isValid: validated[x * 2].status,
      isValidRule: x * 2 - 1 < 0 ? 'unknown' : validated[x * 2 - 1].status,
      rule: x * 2 - 1 < 0 ? undefined : validated[x * 2 - 1].text,
    };
  });

const ifBothBlocksValid: (a: ParsonsStatus, b: ParsonsStatus) => boolean = (
  a,
  b
) =>
  ifCombinationIs([a, b], ['green', 'green']) ||
  ifCombinationIs([a, b], ['green', 'yellow']);

const combineValidatorResults: (
  a: ValidatedParsonsItem[],
  b: ValidatedParsonsItem[]
) => ValidatedParsonsItem[] = (a, b) =>
  a.map<ValidatedParsonsItem>((i, x) => {
    return { ...i, status: combineStatus([i.status, b[x].status]) };
  });

export const combineStatus: (
  tuple: [ParsonsStatus, ParsonsStatus]
) => ParsonsStatus = (tuple) => {
  if (ifAreSame(tuple)) {
    return tuple[0];
  } else if (ifCombinationIs(tuple, ['unknown', 'green'])) {
    return 'green';
  } else if (ifCombinationIs(tuple, ['unknown', 'red'])) {
    return 'red';
  } else if (ifCombinationIs(tuple, ['green', 'red'])) {
    return 'yellow';
  }
  throw new Error();
};

const ifAreSame: <T>(tuple: [T, T]) => boolean = ([a, b]) =>
  ifCombinationIs([a, b], [a, a]);

const ifCombinationIs: <T>(tuple: [T, T], tuple2: [T, T]) => boolean = (
  [a, b],
  [c, d]
) => (a == c && b == d) || (a == d && b == c);

export const getParsonsBlockValidatorDown: () => ParsonsBlockValidator<
  ParsonsItem,
  ValidatedParsonsItem
> = () => {
  return {
    type: 'reduce',
    addToArray: addArrayToEnd,
    getMatchingSolutionBlock: (arr, i, _) => getItemByIndex(arr, i),
  };
};

export const getParsonsBlockValidatorUp: () => ParsonsBlockValidator<
  ParsonsItem,
  ValidatedParsonsItem
> = () => {
  return {
    type: 'reduceRight',
    addToArray: addArrayToStart,
    getMatchingSolutionBlock: getMatchingItemFromEnd,
  };
};

export const getItemByIndex: <T>(arr: T[], index: number) => T | undefined = (
  arr,
  index
) => (arr.length > index ? arr[index] : undefined);

export const getMatchingItemFromEnd: <T>(
  arr: T[],
  index: number,
  length: number
) => T | undefined = (arr, index, length) => arr[index + (arr.length - length)];

export const isItemValid: (
  learnersItem: WithText,
  validItem: WithText
) => ParsonsStatus = (learnersItem, validItem) =>
  learnersItem.text === validItem.text ? 'green' : 'red';

export const addArrayToEnd: <T>(arr: T[], item: T) => T[] = (arr, item) => [
  ...arr,
  item,
];

export const addArrayToStart: <T>(arr: T[], item: T) => T[] = (arr, item) => [
  item,
  ...arr,
];
