import { SolutionResponse } from './typesSolution';
import { ItemType } from '../types';
import { OneFinalResponse } from '../logEx/typesOneFinal';

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

export const OneFinaleResponseToParsonsListLeft: (
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

export const OneFinaleResponseToParsonsListRight: (
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
