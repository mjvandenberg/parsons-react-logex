import { ParsonsItem, ParsonsUiItem, ParsonsProblemProperties } from '../types';
import { OneFinalResponse, Term } from '../logEx/typesOneFinal';
import { ruleMapping } from '../logEx/ruleHelpers';

type ExerciseType = 'equivalence' | 'dnv' | 'cnv';

export const OneFinalToParsonsProblemProperties: (
  oneFinal: OneFinalResponse,
  exerciseType: ExerciseType,
  includeDistractors: boolean
) => ParsonsProblemProperties = (
  oneFinal,
  exerciseType,
  includeDistractors
) => {
  const exerciseSolution = OneFinaleResponseToParsonsSolution(oneFinal);
  const listLeft = exerciseSolution
    .slice(1, -1)
    // inject the distractors
    .map((i) => {
      const index = oneFinal.distractors?.findIndex(
        (e) => e.fromTerm === i.text
      )!;
      return includeDistractors && oneFinal.distractors && index >= 0
        ? [
            i,
            {
              ...i,
              id: `${i.id}_${index}`,
              text: oneFinal.distractors[index].term,
            },
          ]
        : [i];
    })
    .flat()
    .map((i) => {
      return { ...i, rule: undefined };
    });

  const listRight: ParsonsUiItem[] = [
    { ...exerciseSolution.at(0)!, isStaticFirst: true },
    { ...exerciseSolution.at(-1)!, isStaticLast: true },
  ].map((i) => {
    return { ...i, rule: undefined };
  });

  return {
    exerciseName: 'Exercise 5',
    exerciseDescription: GetExerciseDescription(oneFinal, exerciseType),
    exerciseSolution: oneFinal.onefinal.context.term.reduce<ParsonsItem[]>(
      (prev, curr, index, arr) => {
        if (index % 2 === 0) {
          if (prev.some((i) => i.text === curr.toString())) {
            return prev;
          }
          return [...prev, { text: curr.toString(), type: 'block' }];
        }
        const term = curr as Term;
        if (term.motivation === '<CLOSE>') {
          return prev;
        }
        const ruleName = ruleMapping[term.motivation];
        return [...prev, { text: ruleName, type: 'rule' }];
      },
      []
    ),
    listLeft: groupPairs(shuffle(listLeft)),
    listRight,
  };
};

export const groupPairs = (list: ParsonsUiItem[]) => {
  return list.reduce<ParsonsUiItem[]>(
    (previousValue, currentItem, currentIndex, arr) => {
      return !currentItem.pairedGroupName ||
        arr.filter((i) => i.pairedGroupName === currentItem.pairedGroupName)
          .length === 1
        ? [...previousValue, currentItem]
        : previousValue.find(
            (i) => i.pairedGroupName === currentItem.pairedGroupName
          )
        ? [...previousValue]
        : [
            ...previousValue,
            currentItem,
            arr.find((i) => {
              return (
                i.pairedGroupName === currentItem.pairedGroupName &&
                i.text !== currentItem.text
              );
            })!,
          ];
    },
    []
  );
};

const GetExerciseDescription = (
  oneFinal: OneFinalResponse,
  exerciseType: ExerciseType
) => {
  switch (exerciseType) {
    case 'equivalence':
      return (
        <>
          Prove{' '}
          <span className="katex">
            {oneFinal.onefinal.context.term.at(0)?.toString()}
          </span>{' '}
          is logically equivalent to{' '}
          <span className="katex">
            {oneFinal.onefinal.context.term.at(-1)?.toString()}
          </span>
        </>
      );
    default:
      return (
        <>
          Convert{' '}
          <span className="katex">
            {oneFinal.onefinal.context.term.at(0)?.toString()}
          </span>
          {` to ${exerciseType === 'cnv' && 'conjunctive'}${
            exerciseType === 'dnv' && 'disjuntive'
          } normal form`}
        </>
      );
  }
};

export const OneFinaleResponseToParsonsSolution: (
  oneFinalResponse: OneFinalResponse
) => ParsonsUiItem[] = (oneFinalResponse) => {
  const first = oneFinalResponse.onefinal.context.term.at(0)!;
  return [
    {
      text: first.toString(),
      isStaticFirst: true,
      isStaticLast: false,
      id: `right_${0}`,
      pairedGroupName: `right_${0}`,
      isValid: 'unknown',
      isValidRule: 'unknown',
    },
    ...(Object.values(
      oneFinalResponse.onefinal.context.term
        .slice(1)
        .reduce<{ [index: string]: ParsonsUiItem | undefined }>(
          (prev, current, index, arr) => {
            return {
              ...prev,
              [index.toString()]:
                index % 2 === 0 ||
                (index > 0 && (arr[index - 1] as Term).motivation === '<CLOSE>')
                  ? undefined
                  : {
                      text: current.toString(),
                      id: index,
                      pairedGroupName: index.toString(),
                      rule:
                        index > 0
                          ? ruleMapping[(arr[index - 1] as Term).motivation]
                          : undefined,
                      isValid: 'unknown',
                      isValidRule: 'unknown',
                    },
            };
          },
          {}
        )
    ).filter((i) => i !== undefined) as ParsonsUiItem[]),
  ];
};

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
