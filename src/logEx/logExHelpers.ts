import { Solution } from './typesSolution';
import { ItemType } from '../types';

export const solutionToListOne: (solution: Solution) => ItemType[] = (
  solution: Solution
) => {
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

export const solutionToListTwo: (solution: Solution) => ItemType[] = (
  solution: Solution
) => {
  return [
    {
      id: 1,
      text: solution?.derivation?.derivation?.context?.term ?? '-',
      isStaticFirst: true,
    },
  ];
};
