import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsUiItem, ParsonsProblemProperties } from '../types';
import HelpButton from './HelpButton';
import { ConvertItemToUiItem, ConvertUiItemToItem, validateParsonsProblem2 } from '../validate';

const Parsons: FC<ParsonsProblemProperties & { onReset: () => void }> = ({
  exerciseName,
  exerciseDescription,
  exerciseSolution,
  onReset,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsUiItem[]>(props.listLeft);
  const [listRight, _setListRight] = useState<ParsonsUiItem[]>(props.listRight);
  const [showFeedback, setShowFeedback] = useState(false);
  const [help, setHelp] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(false);

  const setListRight = (list: ParsonsUiItem[]) => {
    setShowFeedback(false);
    const converted = ConvertUiItemToItem(list);
    const [newList, newIsValid] = validateParsonsProblem2(
      converted,
      exerciseSolution
    );
    _setListRight(ConvertItemToUiItem(list, newList));
    setIsValid(newIsValid);
  };

  const handleChangeItemLeft: (item: ParsonsUiItem) => void = (item) => {
    setShowFeedback(false);
    setListLeft(listLeft.map((i) => (i.id === item.id ? item : i)));
  };

  const handleChangeItemRight: (item: ParsonsUiItem) => void = (item) => {
    setShowFeedback(false);
    setListRight(listRight.map((i) => (i.id === item.id ? item : i)));
  };

  const handleResetButtonClick = () => {
    onReset();
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
          className="btn btn-primary normal-case mx-1 min-w-[130px]"
          onClick={handleFeedbackButtonClick}
        >
          Check solution
        </button>
        <button
          className="btn btn-primary normal-case mx-1 min-w-[130px]"
          onClick={handleResetButtonClick}
        >
          Reset puzzle
        </button>

        {/*<HelpButton />*/}
      </div>
      <pre className="text-left">
        {false && JSON.stringify(exerciseSolution, null, 2)}
      </pre>
    </>
  );
};

export default Parsons;
