import { FC } from 'react';
import { ParsonsItem, Settings } from '../types';
import InfoIcon from './InfoIcon';

type Props = {
  hintItem: ParsonsItem;
  settings: Settings;
};

const ParsonsHint: FC<Props> = ({ hintItem, settings }) => {
  return (
    <div className="basis-0 bg-[#ffffaa] rounded border-[#b8b8b8] border-1 border p-2 m-3">
      <InfoIcon />
      <strong>Hint:</strong> Try to use the block with formula
      <span className="katex font-bold">{hintItem.text}</span> somewhere in your
      solution.
      {!settings.instantFeedback && (
        <>
          {' '}
          You can click on the <span className="font-bold">Check me</span>{' '}
          button to validate your solution.
        </>
      )}
    </div>
  );
};

export default ParsonsHint;
