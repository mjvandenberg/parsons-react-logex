import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsItem, ParsonsProblemProperties } from '../types';
import { Button, Dropdown } from 'flowbite-react';

const Parsons: FC<ParsonsProblemProperties> = ({
  exerciseName,
  exerciseDescription,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [listRight, setListRight] = useState<ParsonsItem[]>(props.listRight);
  const [showFeedback, setShowFeedback] = useState(false);

  const [initialListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [initialListRight] = useState<ParsonsItem[]>(props.listRight);

  const [exerciseSolution] = useState<ParsonsItem[]>(props.exerciseSolution);

  const handleChangeItemLeft: (item: ParsonsItem) => void = (item) => {
    setListLeft(listLeft.map((i) => (i.id === item.id ? item : i)));
  };

  const handleChangeItemRight: (item: ParsonsItem) => void = (item) => {
    setListRight(listRight.map((i) => (i.id === item.id ? item : i)));
  };

  const handleResetButtonClick = () => {
    setListLeft(initialListLeft);
    setListRight(initialListRight);
    setShowFeedback(false);
  };

  const handleFeedbackButtonClick = () => {
    setShowFeedback(true);
  };

  return (
    <>
      <pre className="text-left">
        {false && JSON.stringify(listLeft, null, 2)}
      </pre>
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
          showFeedback={showFeedback}
          exerciseSolution={exerciseSolution}
        />
      </div>
      <div className="flex flex-row max-w-[1000px] p-2 m-3 gap-1">
        <Button color="gray" onClick={handleResetButtonClick}>
          Reset
        </Button>
        <Button color="gray" onClick={handleFeedbackButtonClick}>
          Feedback
        </Button>
        <Dropdown color="gray" label="Help" className="bg-red-800">
          <Dropdown.Item>Hint</Dropdown.Item>
          <Dropdown.Item>Show step</Dropdown.Item>
          <Dropdown.Item>Show complete derivation</Dropdown.Item>
          <Dropdown.Item>Complete my derivation</Dropdown.Item>
        </Dropdown>
      </div>
    </>
  );
};

export default Parsons;
