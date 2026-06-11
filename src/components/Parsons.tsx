import './Parsons.css';
import { FC, useEffect, useState } from 'react';
import ParsonsTitle from './ParsonsTitle';
import ParsonsDropArea, { dragInfo, position } from './ParsonsDropArea';
import {
  ParsonsUiItem,
  ParsonsProblemProperties,
  Settings,
  ParsonsItem,
} from '../types';
import HelpButton from './HelpButton';
import {
  countNumberOfItemsValid,
  validateParsonsProblemFromUi,
} from '../validate';
import ParsonsHint from './ParsonsHint';

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
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [dragInfo, setDragInfo] = useState<dragInfo>({
    dragging: false,
    from: undefined,
    to: undefined,
  });
  const [hintItem, setHintItem] = useState<ParsonsItem>();

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

  const handleOnClickHint = () => {
    hideList();
    setShowHint(true);
  };

  const randomLessThanOrLessEqualThan: (
    first: number,
    second: number
  ) => boolean = (first, second) => {
    const oneOrZero = Math.random() >= 0.5 ? 1 : 0;
    if (oneOrZero == 0) {
      return first <= second;
    } else {
      return first < second;
    }
  };

  const findDistractorInRight = (): ParsonsUiItem | undefined => {
    return listRight.find(
      (item) =>
        exerciseSolution.find(
          (s) => s.text === item.text && s.type === 'block'
        ) === undefined
    );
  };

  const removeDistractor = (distractor: ParsonsUiItem) => {
    setListLeft([...listLeft, distractor]);
    setListRight(listRight.filter((item) => item.text !== distractor.text));
  };

  const findTopDownHintIndex = (): number => {
    return exerciseSolution.findIndex(
      (item, index) => index % 2 === 0 && listRight[index / 2].text !== item.text
    );
  };

  const findBottomUpHintIndex = (): { indexToAdd: number; solutionIndex: number } => {
    for (let x = 0; x < listRight.length; x++) {
      if (
        listRight[listRight.length - 1 - x].text !==
        exerciseSolution[exerciseSolution.length - 1 - 2 * x].text
      ) {
        return {
          indexToAdd: listRight.length - 1 - x,
          solutionIndex: exerciseSolution.length - 1 - 2 * x,
        };
      }
    }
    return { indexToAdd: -1, solutionIndex: -1 };
  };

  const applyTopDownHint = (index: number) => {
    setListRight(
      listRight.reduce<ParsonsUiItem[]>((acc, currentItem, currentIndex) => {
        return index / 2 === currentIndex
          ? [
              ...acc,
              {
                ...exerciseSolution[index],
                isValid: 'green',
                id: `hinteditem_${index}`,
                isValidRule: 'red',
                rule: index === 0 ? undefined : exerciseSolution[index - 1].text,
              } as ParsonsUiItem,
              currentItem,
            ]
          : [...acc, currentItem];
      }, [])
    );
    setListLeft(
      listLeft.filter((item) => item.text !== exerciseSolution[index].text)
    );
  };

  const applyBottomUpHint = (indexToAdd: number, solutionIndex: number) => {
    setListRight(
      listRight.reduce<ParsonsUiItem[]>((acc, currentItem, currentIndex) => {
        return indexToAdd + 1 === currentIndex
          ? [
              ...acc,
              {
                ...exerciseSolution[solutionIndex],
                isValid: 'green',
                id: `hinteditem_${solutionIndex}`,
                isValidRule: 'red',
              } as ParsonsUiItem,
              {
                ...currentItem,
                rule: exerciseSolution[solutionIndex + 1].text,
              },
            ]
          : [...acc, currentItem];
      }, [])
    );
    setListLeft(
      listLeft.filter((item) => item.text !== exerciseSolution[solutionIndex].text)
    );
  };

  const handleOnClickShowStep = () => {
    hideList();

    const distractor = findDistractorInRight();
    if (distractor) {
      removeDistractor(distractor);
      return;
    }

    const downwards = randomLessThanOrLessEqualThan(
      countNumberOfItemsValid(listRight, 'downwards'),
      countNumberOfItemsValid(listRight, 'upwards')
    );

    if (downwards) {
      const index = findTopDownHintIndex();
      if (index === -1) {
        handleOnClickCompleteDerivation();
        return;
      }
      applyTopDownHint(index);
    } else {
      const { indexToAdd, solutionIndex } = findBottomUpHintIndex();
      if (indexToAdd === -1) {
        handleOnClickCompleteDerivation();
        return;
      }
      applyBottomUpHint(indexToAdd, solutionIndex);
    }
  };

  const handleOnClickShowDerivation = () => {
    hideList();
  };

  const handleOnClickCompleteDerivation = () => {
    hideList();

    setListLeft(
      listLeft.reduce<ParsonsUiItem[]>(
        (previousValue, currentItem, currentIndex, arr) => {
          return exerciseSolution.findIndex(
            (i) => i.text === currentItem.text
          ) === -1
            ? [...previousValue, currentItem]
            : [...previousValue];
        },
        []
      )
    );

    setListRight(
      exerciseSolution.reduce<ParsonsUiItem[]>(
        (previousValue, currentItem, currentIndex, arr) => {
          return currentIndex % 2 === 0
            ? [
                ...previousValue,
                {
                  ...currentItem,
                  id: `hinteditem_${currentIndex}`,
                  isValid: 'green',
                  isValidRule: 'green',
                  rule:
                    currentIndex === 0 ? undefined : arr[currentIndex - 1].text,
                } as ParsonsUiItem,
              ]
            : [...previousValue];
        },
        []
      )
    );
  };

  const hideList = () => {
    // @ts-ignore
    document?.activeElement?.blur();
  };

  useEffect(() => {
    const item = exerciseSolution.find((item, index) => {
      return index % 2 === 0 && listRight[index / 2].text !== item.text;
    });
    setHintItem(item);
  }, [showHint, listRight]);

  return (
    <>
      <ParsonsTitle exerciseName={exerciseName}>
        {exerciseDescription}
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
