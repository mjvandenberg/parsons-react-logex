import { SolutionResponse } from './typesSolution';
import { ItemType } from '../types';
import { OneFinalResponse } from '../logEx/typesOneFinal';

type ExerciseType = 'equivalence' | 'dnv' | 'cnv';

export const solutionResponseToParsonsListLeft: (
  solution: SolutionResponse
) => ItemType[] = (solution: SolutionResponse) => {
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
) => ItemType[] = (solution: SolutionResponse) => {
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
) => ItemType[] = (oneFinalResponse: OneFinalResponse) => {
  return oneFinalResponse.onefinal.context.term
    .filter((i) => typeof i === 'string')
    .map((i, x) => {
      return {
        text: i.toString(),
        id: x,
        pairedGroupName: x.toString(),
      };
    });
};

const OneFinaleResponseToParsonsListRight: (
  oneFinalResponse: OneFinalResponse
) => ItemType[] = (oneFinalResponse: OneFinalResponse) => {
  return [
    oneFinalResponse.onefinal.context.term.at(0),
    oneFinalResponse.onefinal.context.term.at(-1),
  ].map((i, x) => {
    return {
      text: i ? i.toString() : '-',
      isStaticFirst: x === 0,
      isStaticLast: x === 1,
      id: x,
      pairedGroupName: x.toString(),
    };
  });
};
