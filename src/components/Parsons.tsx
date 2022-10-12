import { FC, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ItemType } from '../types';
import Button from './Button';

type Props = {
  exerciseName: string;
  exerciseDescription: JSX.Element | string;
  listLeft: ItemType[];
  listRight: ItemType[];
};

const Parsons: FC<Props> = ({
  exerciseName,
  exerciseDescription,
  listLeft,
  listRight,
}) => {
  const [list1, setList1] = useState<ItemType[]>(listLeft);
  const [list2, setList2] = useState<ItemType[]>(listRight);

  return (
    <>
      <ParsonsTitle exerciseName={exerciseName}>
        {exerciseDescription}
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
