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
  getMatchingSolutionItem: (
    arr: T[],
    currentIndex: number,
    length: number
  ) => T | undefined;
};

type ParsonsValidateFunc<T, T2> = (
  toValidate: T[],
  solution: T[],
  validator: ParsonsBlockValidator<T, T2>,
  autoFillRewriteRules: boolean
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
  autoFillRewriteRules?: boolean
) => [ValidatedParsonsItem[], boolean] = (
  toValidate,
  solution,
  autoFillRewriteRules = false
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
      getParsonsValidatorDown(),
      getParsonsValidatorUp(),
    ];

    const executeValidators = (solution: ParsonsItem[]) => {
      const results = [solution, [...solution].reverse()].map((solution) =>
        validators
          .map((validator) => executeValidator(toValidate, solution, validator, autoFillRewriteRules))
          .reduce<ValidatedParsonsItem[]>(
            (acc, curr, index) =>
              index === 0 ? curr : combineValidatorResults(acc, curr),
            []
          ));
      return results.sort(r => 0 - r.filter(i => i.status === "green").length)[0];
    }

    const result = executeValidators(solution);

    const isValid = !result.some((i) => i.status !== 'green');

    return [result, isValid];
  };

export const executeValidator: ParsonsValidateFunc<
  ParsonsItem,
  ValidatedParsonsItem
> = (toValidate, solution, validator, autoFillRewriteRules) => {
  let stop = false;

  const blocksValidated = toValidate[validator.type]<ValidatedParsonsItem[]>(
    // First validate the blocks
    (acc, curr, index) => {
      if (stop || curr.type !== 'block') {
        return validator.addToArray(acc, { ...curr, status: 'unknown' });
      }

      const matchingSolutionBlock = validator.getMatchingSolutionItem(
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

  // Second validate the rewrite rules
  const rulesValidated = blocksValidated[validator.type]<ValidatedParsonsItem[]>(
    (acc, curr, index) => {
      if (curr.type !== 'rule') {
        return validator.addToArray(acc, curr);
      }

      const blockAbove = blocksValidated[index - 1];
      const blockBelow = blocksValidated[index + 1];

      if (blockAbove.status !== "green" || blockBelow.status !== "green") {
        return validator.addToArray(acc,
          {
            ...curr,
            status: 'unknown',
            text: autoFillRewriteRules ? '' : curr.text
          });
      }

      const matchingSolutionRule = validator.getMatchingSolutionItem(
        solution,
        index,
        toValidate.length
      );

      let status: ParsonsStatus = 'red';

      if (matchingSolutionRule) {
        if (autoFillRewriteRules) {
          status = 'green';
          return validator.addToArray(acc, { ...curr, status, text: matchingSolutionRule.text });
        }
        status = isItemValid(curr, matchingSolutionRule);
      }

      return validator.addToArray(acc, { ...curr, status });
    },
    []
  );

  return rulesValidated;
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

const combineValidatorResults: (
  a: ValidatedParsonsItem[],
  b: ValidatedParsonsItem[]
) => ValidatedParsonsItem[] = (a, b) =>
    a.map<ValidatedParsonsItem>((i, x) => {
      return {
        ...i,
        text: i.text === '' ? b[x].text : i.text,
        status: combineStatus([i.status, b[x].status])
      };
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
    return 'green';
  }
  throw new Error();
};

const ifAreSame: <T>(tuple: [T, T]) => boolean = ([a, b]) =>
  ifCombinationIs([a, b], [a, a]);

const ifCombinationIs: <T>(tuple: [T, T], tuple2: [T, T]) => boolean = (
  [a, b],
  [c, d]
) => (a == c && b == d) || (a == d && b == c);

export const getParsonsValidatorDown: () => ParsonsBlockValidator<
  ParsonsItem,
  ValidatedParsonsItem
> = () => {
  return {
    type: 'reduce',
    addToArray: addArrayToEnd,
    getMatchingSolutionItem: (arr, i, _) => getItemByIndex(arr, i),
  };
};

export const getParsonsValidatorUp: () => ParsonsBlockValidator<
  ParsonsItem,
  ValidatedParsonsItem
> = () => {
  return {
    type: 'reduceRight',
    addToArray: addArrayToStart,
    getMatchingSolutionItem: getMatchingItemFromEnd,
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

export const countNumberOfItemsValid: (
  list: ParsonsUiItem[],
  direction: 'downwards' | 'upwards'
) => number = (list, direction) => {
  return list[direction === 'downwards' ? 'reduce' : 'reduceRight']<
    [boolean, number]
  >(
    (previousValue, currentItem, currentIndex, arr) => {
      if (previousValue[0]) {
        return previousValue;
      }
      if (
        currentItem.isValid === 'green' &&
        currentItem.isValidRule === 'green'
      ) {
        return [previousValue[0], previousValue[1] + 1];
      }
      if (
        currentItem.isValid === 'green' &&
        currentItem.isValidRule === 'unknown' &&
        currentIndex === 0
      ) {
        return [previousValue[0], previousValue[1] + 1];
      }
      return [true, previousValue[1]];
    },
    [false, 0]
  )[1];
};
