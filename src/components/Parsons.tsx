import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea from './ParsonsDropArea';
import { ParsonsUiItem, ParsonsProblemProperties, Settings } from '../types';
import HelpButton from './HelpButton';
import { validateParsonsProblemFromUi } from '../validate';

const Parsons: FC<
  ParsonsProblemProperties & {
    onReset: () => void;
    showFeedback: boolean;
    setShowFeedback: (val: boolean) => void;
    settings: Settings;
  }
> = ({
  exerciseName,
  exerciseDescription,
  exerciseSolution,
  onReset,
  showFeedback,
  setShowFeedback,
  settings,
  ...props
}) => {
  const [listLeft, setListLeft] = useState<ParsonsUiItem[]>(props.listLeft);
  const [listRight, _setListRight] = useState<ParsonsUiItem[]>(props.listRight);
  const [help, setHelp] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(false);

  const setListRight = (list: ParsonsUiItem[]) => {
    setShowFeedback(false);
    const [newList, newIsValid] = validateParsonsProblemFromUi(
      list,
      exerciseSolution,
      settings.autoFillRewriteRules
    );
    _setListRight(newList);
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
    setShowFeedback(!showFeedback);
  };

  useEffect(() => {
    setShowFeedback(false);
    setListLeft(props.listLeft);
    setListRight(props.listRight);
  }, [props.listLeft, props.listRight]);

  useEffect(() => {
    if (settings.autoFillRewriteRules) {
      setListRight(listRight);
    } else {
      setListRight(
        listRight.map((i) => {
          return { ...i, rule: undefined };
        })
      );
    }
  }, [settings.autoFillRewriteRules]);

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
          settings={settings}
        />
        <ParsonsDropArea
          title="Construct your solution here"
          list={listRight}
          setList={setListRight}
          position="right"
          onChangeItem={handleChangeItemRight}
          showFeedback={showFeedback}
          isValid={showFeedback === false ? undefined : isValid}
          settings={settings}
        />
      </div>
      <div className="flex justify-center">
        {settings.instantFeedback === false && (
          <button
            className="btn btn-primary normal-case mx-1 min-w-[130px]"
            onClick={handleFeedbackButtonClick}
          >
            Validate solution
          </button>
        )}
        <button
          className="btn btn-primary normal-case mx-1 min-w-[130px] z-10"
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
