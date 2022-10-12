import { FC, useState } from 'react';
import { SolutionResponse } from '../logEx/typesSolution';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ItemType } from '../types';
import { solutionToListOne, solutionToListTwo } from '../logEx/logExHelpers';
import Button from './Button';

type Props = {
  solution: SolutionResponse;
};

const Parsons: FC<Props> = ({ solution }) => {
  const [list1, setList1] = useState<ItemType[]>(solutionToListOne(solution));
  const [list2, setList2] = useState<ItemType[]>(solutionToListTwo(solution));

  return (
    <>
      <ParsonsTitle exerciseName={'Exercise 5'}>
        <>
          Convert{' '}
          <span className="katex">
            {solution.derivation.derivation?.context?.term}
          </span>{' '}
          to conjunctive normal form
        </>
      </ParsonsTitle>
      <div className="flex flex-row p-2 m-3">
        <ParsonsDropArea
          title="Drag from here"
          list={list1}
          setList={setList1}
        />
        <ParsonsDropArea
          title="Construct your solution here"
          list={list2}
          setList={setList2}
          position="right"
        />
      </div>
      <div className="flex flex-row max-w-[1000px] p-2 m-3">
        <div className="basis-1/2 mx-1">
          <Button>reset</Button>
        </div>
        <div className="basis-1/2 mx-1">
          <Button>feedback</Button>
        </div>
      </div>
    </>
  );
};

export default Parsons;
