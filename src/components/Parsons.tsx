import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea, { dragInfo, position } from './ParsonsDropArea';
import { ParsonsUiItem, ParsonsProblem, ParsonsState, Settings } from '../types';
import HelpButton from './HelpButton';
import { validateParsonsProblemFromUi } from '../core/validate';
import { completeExercise, completeStep, findHintBlock } from '../core/help';
import ParsonsHint from './ParsonsHint';
import ExerciseDescriptionText from './ExerciseDescriptionText';

const Parsons: FC<
  ParsonsProblem & {
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
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [dragInfo, setDragInfo] = useState<dragInfo>({
    dragging: false,
    from: undefined,
    to: undefined,
  });

  const setListRight = (list: ParsonsUiItem[]) => {
    setShowFeedback(false);
    const [newList, newIsValid] = validateParsonsProblemFromUi(
      list,
      exerciseSolution,
      settings.autoFillRewriteRules
    );
    _setListRight(newList);
    setIsValid(newIsValid);
    if (newIsValid === true) {
      setShowFeedback(true);
    }
    setShowHint(false);
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

  const applyHelp = (state: ParsonsState) => {
    setListLeft(state.left);
    setListRight(state.right);
  };

  const handleOnClickHint = () => {
    hideList();
    setShowHint(true);
  };

  const handleOnClickShowStep = () => {
    hideList();
    applyHelp(
      completeStep({ left: listLeft, right: listRight }, exerciseSolution)
    );
  };

  const handleOnClickShowDerivation = () => {
    hideList();
  };

  const handleOnClickCompleteDerivation = () => {
    hideList();
    applyHelp(
      completeExercise({ left: listLeft, right: listRight }, exerciseSolution)
    );
  };

  const hideList = () => {
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const hintItem = showHint
    ? findHintBlock(exerciseSolution, listRight)
    : undefined;

  return (
    <>
      <ParsonsTitle exerciseName={exerciseName}>
        <ExerciseDescriptionText description={exerciseDescription} />
      </ParsonsTitle>
      {showHint && hintItem && (
        <>{true && <ParsonsHint hintItem={hintItem} settings={settings} />}</>
      )}
      {showHint && !hintItem && (
        <div className="basis-0 bg-[#fcfcfc] rounded border-[#b8b8b8] border-1 border p-2 m-3">
          <strong>Sorry, no hint available. This is just a prototype.</strong>{' '}
          If you are stuck, you can always use 'Help' to complete one step or
          complete the exercise.
        </div>
      )}
      <div className="flex flex-row p-2 m-3">
        <ParsonsDropArea
          title="Drag from here"
          list={listLeft}
          setList={setListLeft}
          position="left"
          onChangeItem={handleChangeItemLeft}
          settings={settings}
          dragInfo={dragInfo}
          setDragInfo={setDragInfo}
          numberOfItemForSize={listLeft.length + listRight.length - 2}
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
          dragInfo={dragInfo}
          setDragInfo={setDragInfo}
          numberOfItemForSize={listLeft.length + listRight.length - 2}
        />
      </div>
      <div
        className={`flex justify-center ${dragInfo.dragging && 'opacity-0'}`}
      >
        {settings.instantFeedback === false && (
          <button
            className={`btn btn-primary normal-case mx-1 min-w-[130px] z-10`}
            onClick={handleFeedbackButtonClick}
          >
            Check solution
          </button>
        )}
        <button
          className={`btn btn-primary normal-case mx-1 min-w-[130px] z-10`}
          onClick={handleResetButtonClick}
        >
          Reset
        </button>

        <HelpButton
          onClickHint={handleOnClickHint}
          onClickShowStep={handleOnClickShowStep}
          onClickShowDerivation={handleOnClickShowDerivation}
          onClickCompleteDerivation={handleOnClickCompleteDerivation}
        />
      </div>
    </>
  );
};

export default Parsons;
