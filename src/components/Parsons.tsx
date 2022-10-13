import { FC, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsItem, ParsonsProblemProperties } from '../types';
import Button from './Button';

const Parsons: FC<ParsonsProblemProperties> = ({
  exerciseName,
  exerciseDescription,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [listRight, setListRight] = useState<ParsonsItem[]>(props.listRight);

  const handleChangeItemLeft: (item: ParsonsItem) => void = (item) => {
    setListLeft(listLeft.map((i) => (i.id === item.id ? item : i)));
  };

  const handleChangeItemRight: (item: ParsonsItem) => void = (item) => {
    setListRight(listRight.map((i) => (i.id === item.id ? item : i)));
  };

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
          onChangeItem={handleChangeItemLeft}
        />
        <ParsonsDropArea
          title="Construct your solution here"
          list={listRight}
          setList={setListRight}
          position="right"
          onChangeItem={handleChangeItemRight}
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
