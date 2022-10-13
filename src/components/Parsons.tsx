import { FC, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ItemType, ParsonsProblemProperties } from '../types';
import Button from './Button';

const Parsons: FC<ParsonsProblemProperties> = ({
  exerciseName,
  exerciseDescription,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ItemType[]>(props.listLeft);
  const [listRight, setListRight] = useState<ItemType[]>(props.listRight);

  return (
    <>
      <ParsonsTitle exerciseName={exerciseName}>
        {exerciseDescription}
      </ParsonsTitle>
      <div className="flex flex-row p-2 m-3">
        <ParsonsDropArea
          title="Drag from here"
          list={listLeft}
          setList={setListLeft}
          position="left"
        />
        <ParsonsDropArea
          title="Construct your solution here"
          list={listRight}
          setList={setListRight}
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
