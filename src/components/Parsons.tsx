import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsItem, ParsonsProblemProperties } from '../types';
import HelpButton from './HelpButton';
import { validateParsonsProblem } from '../parsons';

const Parsons: FC<ParsonsProblemProperties> = ({
  exerciseName,
  exerciseDescription,
  exerciseSolution,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [listRight, _setListRight] = useState<ParsonsItem[]>(props.listRight);
  const [showFeedback, setShowFeedback] = useState(false);
  const [help, setHelp] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean>(false);

  const [initialListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [initialListRight] = useState<ParsonsItem[]>(props.listRight);

  const setListRight = (list: ParsonsItem[]) => {
    setShowFeedback(false);
    const [newList, newIsValid] = validateParsonsProblem(
      list,
      exerciseSolution
    );
    _setListRight(newList);
    setIsValid(newIsValid);
  };

  const handleChangeItemLeft: (item: ParsonsItem) => void = (item) => {
    setShowFeedback(false);
    setListLeft(listLeft.map((i) => (i.id === item.id ? item : i)));
  };

  const handleChangeItemRight: (item: ParsonsItem) => void = (item) => {
    setShowFeedback(false);
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

  useEffect(() => {
    setShowFeedback(false);
    setListLeft(props.listLeft);
    setListRight(props.listRight);
  }, [props.listLeft, props.listRight]);

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
          showFeedback={showFeedback}
          isValid={showFeedback === false ? undefined : isValid}
        />
      </div>
      <div className="flex justify-center">
        <button
          className="btn btn-primary normal-case mx-1"
          onClick={handleResetButtonClick}
        >
          Reset
        </button>
        <button
          className="btn btn-primary normal-case mx-1"
          onClick={handleFeedbackButtonClick}
        >
          Feedback
        </button>
        <HelpButton />
      </div>
      <pre className="text-left">
        {false && JSON.stringify(exerciseSolution, null, 2)}
      </pre>
    </>
  );
};

export default Parsons;
