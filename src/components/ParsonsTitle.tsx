import { FC } from 'react';

type Props = {
  exerciseName: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const ParsonsTitle: FC<Props> = ({ exerciseName, children }) => {
  return (
    <div className="basis-0 bg-[#fcfcfc] rounded border-[#b8b8b8] border-1 border p-2 m-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current flex-shrink-0 w-6 h-6 inline-block mr-1 relative bottom-[2px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <strong>{exerciseName}: </strong>
      {children}
    </div>
  );
};

export default ParsonsTitle;
