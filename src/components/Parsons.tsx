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

  //TODO: this messy method needs major refactoring :'-)
  const handleOnClickShowStep = () => {
    hideList();

    //Always remove distractor blocks from listRight if any... Otherwise unexpected behaviour occurs due to this implementation.
    const distractorsFromListRight = listRight.reduce<ParsonsUiItem[]>(
      (previousValue, currentItem, currentIndex, arr) => {
        const solutionItem = exerciseSolution.find(
          (i) => i.text === currentItem.text && i.type === 'block'
        );
        if (solutionItem === undefined) {
          return [...previousValue, currentItem];
        }
        return previousValue;
      },
      []
    );

    if (distractorsFromListRight.length > 0) {
      setListLeft([...listLeft, distractorsFromListRight[0]]);
      setListRight(
        listRight.reduce<ParsonsUiItem[]>(
          (previousValue, currentItem, currentIndex, arr) => {
            if (currentItem.text === distractorsFromListRight[0].text) {
              return previousValue;
            }
            return [...previousValue, currentItem];
          },
          []
        )
      );
      return;
    }

    const downwards = randomLessThanOrLessEqualThan(
      countNumberOfItemsValid(listRight, 'downwards'),
      countNumberOfItemsValid(listRight, 'upwards')
    );

    // top to bottom
    if (downwards) {
      const index = exerciseSolution.findIndex((item, index) => {
        return index % 2 === 0 && listRight[index / 2].text !== item.text;
      });

      if (index === -1) {
        handleOnClickCompleteDerivation();
        return;
      }

      setListRight(
        listRight.reduce<ParsonsUiItem[]>(
          (previousValue, currentItem, currentIndex, arr) => {
            return index / 2 === currentIndex
              ? [
                  ...previousValue,
                  {
                    ...exerciseSolution[index],
                    isValid: 'green',
                    id: `hinteditem_${index}`,
                    isValidRule: 'red',
                    rule:
                      index === 0
                        ? undefined
                        : exerciseSolution[index - 1].text,
                  } as ParsonsUiItem,
                  currentItem,
                ]
              : [...previousValue, currentItem];
          },
          []
        )
      );
      setListLeft(
        listLeft.reduce<ParsonsUiItem[]>(
          (previousValue, currentItem, currentIndex, arr) => {
            return currentItem.text === exerciseSolution[index].text
              ? [...previousValue]
              : [...previousValue, currentItem];
          },
          []
        )
      );
    }

    // bottom up
    if (!downwards) {
      //for (var x=listRight.length-1;x>0;x--)
      let indexToAdd = -1;
      let solutionIndex = -1;

      for (var x = 0; x < listRight.length; x++) {
        if (
          listRight[listRight.length - 1 - x].text !==
          exerciseSolution[exerciseSolution.length - 1 - 2 * x].text
        ) {
          indexToAdd = listRight.length - 1 - x;
          solutionIndex = exerciseSolution.length - 1 - 2 * x;
          break;
        }
      }

      if (indexToAdd === -1) {
        handleOnClickCompleteDerivation();
        return;
      }

      setListRight(
        listRight.reduce<ParsonsUiItem[]>(
          (previousValue, currentItem, currentIndex, arr) => {
            return indexToAdd + 1 === currentIndex
              ? [
                  ...previousValue,
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
              : [...previousValue, currentItem];
          },
          []
        )
      );
      setListLeft(
        listLeft.reduce<ParsonsUiItem[]>(
          (previousValue, currentItem, currentIndex, arr) => {
            return currentItem.text === exerciseSolution[solutionIndex].text
              ? [...previousValue]
              : [...previousValue, currentItem];
          },
          []
        )
      );
    }
  };

  const handleOnClickShowDerivation = () => {
    console.log('show derivation');
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
        <div className="basis-0 bg-[#fcfcfc] rounded border-[#b8b8b8] border-1 border p-2 m-3">
          <strong>Hint:</strong> Try to move the block with formula{' '}
          <span className="katex">{hintItem.text}</span> somewhere in the
          solution area on the right, it is part of the solution!{' '}
          {!settings.instantFeedback &&
            "You can click on 'Check me' to validate your solution."}
        </div>
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
            Check me
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
      <pre className="text-left">
        {false && JSON.stringify(exerciseSolution, null, 2)}
      </pre>
    </>
  );
};

export default Parsons;
