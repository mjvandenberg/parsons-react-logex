import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsItem, ParsonsProblemProperties } from '../types';

const arrowClosed = <span className="arrow-closed" />;
const arrowOpen = <span className="arrow-open" />;

const Parsons: FC<ParsonsProblemProperties> = ({
  exerciseName,
  exerciseDescription,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsItem[]>(props.listLeft);
  const [listRight, setListRight] = useState<ParsonsItem[]>(props.listRight);
  const [showFeedback, setShowFeedback] = useState(false);
  const [help, setHelp] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    setShowFeedback(false);
    setListLeft(props.listLeft);
    setListRight(props.listRight);
  }, [props.listLeft, props.listRight]);

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
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-primary normal-case mx-1">
            Help
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Hint</a>
            </li>
            <li>
              <a>Show step</a>
            </li>
            <li>
              <a>Show complete derivation</a>
            </li>
            <li>
              <a>Complete my derivation</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Parsons;
