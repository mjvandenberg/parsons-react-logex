import { ParsonsItem, ParsonsSolutionItem } from '../types';
import { OneFinalResponse, Term } from '../logEx/typesOneFinal';
import { ruleMapping } from '../logEx/ruleHelpers';

type ExerciseType = 'equivalence' | 'dnv' | 'cnv';

export const OneFinalToParsonsProblemProperties = (
  oneFinal: OneFinalResponse,
  exerciseType: ExerciseType,
  includeDistractors: boolean
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
        : [{ ...i, rule: undefined }];
    })
    .flat();

  const listRight: ParsonsItem[] = [
    { ...exerciseSolution.at(0)!, isStaticFirst: true },
    { ...exerciseSolution.at(-1)!, isStaticLast: true },
  ].map((i) => {
    return { ...i, rule: undefined };
  });

  return {
    exerciseName: 'Exercise 5',
    exerciseDescription: GetExerciseDescription(oneFinal, exerciseType),
    exerciseSolution: exerciseSolution.map<ParsonsSolutionItem>((i) => {
      return i.rule ? { text: i.text, rule: i.rule } : { text: i.text };
    }),
    listLeft,
    listRight,
  };
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
) => ParsonsItem[] = (oneFinalResponse) => {
  const first = oneFinalResponse.onefinal.context.term.at(0)!;
  return [
    {
      text: first.toString(),
      isStaticFirst: true,
      isStaticLast: false,
      id: `right_${0}`,
      pairedGroupName: `right_${0}`,
    },
    ...(Object.values(
      oneFinalResponse.onefinal.context.term
        .slice(1)
        .reduce<{ [index: string]: ParsonsItem | undefined }>(
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
                    },
            };
          },
          {}
        )
    ).filter((i) => i !== undefined) as ParsonsItem[]),
  ];
};
