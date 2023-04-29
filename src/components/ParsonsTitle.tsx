import { FC } from 'react';
import InfoIcon from './InfoIcon';

type Props = {
  exerciseName: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const ParsonsTitle: FC<Props> = ({ exerciseName, children }) => {
  return (
    <div className="basis-0 bg-[#fcfcfc] rounded border-[#b8b8b8] border-1 border p-2 m-3">
      <InfoIcon />
      <strong>{exerciseName}: </strong>
      {children}
    </div>
  );
};

export default ParsonsTitle;
