import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea, { dragInfo, position } from './ParsonsDropArea';
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

  const handleOnClickHint = () => {
    console.log('hint');
    hideList();
  };

  const handleOnClickShowStep = () => {
    console.log('show step');
    // 1. vind item dat geplaatst moet worden
    const index = exerciseSolution.findIndex((item, index) => {
      return index % 2 === 0 && listRight[index / 2].text !== item.text;
    });
    alert(JSON.stringify([index, exerciseSolution[index].text]));
    // 2. markeer het item dat verplaatst moet worden inclusief begeleidende tekst
    // 3. eventueel animeer dat het blok verplaatst wordt
    // 4. verplaats het block
    hideList();
  };

  const handleOnClickShowDerivation = () => {
    console.log('show derivation');
    hideList();
  };

  const handleOnClickCompleteDerivation = () => {
    console.log('complete derivation');
    hideList();
  };

  const hideList = () => {
    // @ts-ignore
    document?.activeElement?.blur();
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
      <div className="flex justify-center">
        {settings.instantFeedback === false && (
          <button
            className={`btn btn-primary normal-case mx-1 min-w-[130px] z-10 ${
              dragInfo.dragging && 'opacity-0'
            }`}
            onClick={handleFeedbackButtonClick}
          >
            Check me
          </button>
        )}
        <button
          className={`btn btn-primary normal-case mx-1 min-w-[130px] z-10 ${
            dragInfo.dragging && 'opacity-0'
          }`}
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
      <pre className="text-left">
        {false && JSON.stringify(exerciseSolution, null, 2)}
      </pre>
    </>
  );
};

export default Parsons;
