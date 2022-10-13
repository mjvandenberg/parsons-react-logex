import { SolutionResponse } from './typesSolution';
import { ParsonsItem } from '../types';
import { OneFinalResponse } from '../logEx/typesOneFinal';
import { uniq } from '../array';

type ExerciseType = 'equivalence' | 'dnv' | 'cnv';

export const solutionResponseToParsonsListLeft: (
  solution: SolutionResponse
) => ParsonsItem[] = (solution: SolutionResponse) => {
  return (
    solution?.derivation?.derivation?.derivationsteps?.map((i, x) => {
      return {
        id: x,
        text: i.context.term,
        ...(x >= 2 && x <= 3
          ? { pairedGroupName: 'G' }
          : { pairedGroupName: x.toString() }),
      };
    }) ?? []
  );
};

export const solutionResponseToParsonsListRight: (
  solution: SolutionResponse
) => ParsonsItem[] = (solution: SolutionResponse) => {
  return [
    {
      id: 1,
      text: solution?.derivation?.derivation?.context?.term ?? '-',
      isStaticFirst: true,
    },
  ];
};

export const OneFinalToParsonsProblemProperties = (
  oneFinal: OneFinalResponse,
  exerciseType: ExerciseType
) => {
  return {
    exerciseName: 'Exercise 5',
    exerciseDescription: GetExerciseDescription(oneFinal, exerciseType),
    listLeft: OneFinaleResponseToParsonsListLeft(oneFinal),
    listRight: OneFinaleResponseToParsonsListRight(oneFinal),
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

const OneFinaleResponseToParsonsListLeft: (
  oneFinalResponse: OneFinalResponse
) => ParsonsItem[] = (oneFinalResponse: OneFinalResponse) => {
  return uniq(
    oneFinalResponse.onefinal.context.term.filter((i) => typeof i === 'string')
  )
    .slice(1, -1)
    .map((i, x) => {
      return {
        text: i.toString(),
        id: `left_${x}`,
        pairedGroupName: `left_${x}`,
      };
    });
};

const OneFinaleResponseToParsonsListRight: (
  oneFinalResponse: OneFinalResponse
) => ParsonsItem[] = (oneFinalResponse: OneFinalResponse) => {
  return [
    oneFinalResponse.onefinal.context.term.at(0),
    oneFinalResponse.onefinal.context.term.at(-1),
  ].map((i, x) => {
    return {
      text: i ? i.toString() : '-',
      isStaticFirst: x === 0,
      isStaticLast: x === 1,
      id: `right_${x}`,
      pairedGroupName: `right_${x}`,
    };
  });
};
