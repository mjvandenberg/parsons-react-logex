import { FC } from 'react';

type Props = {
  exerciseName: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const ParsonsTitle: FC<Props> = ({ exerciseName, children }) => {
  return (
    <div className="basis-0 bg-[#fcfcfc] rounded border-[#b8b8b8] border-1 border p-2 m-3">
      <img
        src="/src/info.svg"
        style={{ width: '1em', height: '1em', verticalAlign: '-.125em' }}
        className="inline-block mr-1"
        alt="info"
      />
      <strong>{exerciseName}: </strong>
      {children}
    </div>
  );
};

export default ParsonsTitle;
