import { FC } from 'react';
import { ExerciseDescription } from '../types';

const normalForm = { cnv: 'conjunctive', dnv: 'disjunctive' } as const;

const ExerciseDescriptionText: FC<{ description: ExerciseDescription }> = ({
  description: { type, from, to },
}) =>
  type === 'equivalence' ? (
    <>
      Prove <span className="katex">{from}</span> is logically equivalent to{' '}
      <span className="katex">{to}</span>
    </>
  ) : (
    <>
      Convert <span className="katex">{from}</span> to {normalForm[type]} normal
      form
    </>
  );

export default ExerciseDescriptionText;
