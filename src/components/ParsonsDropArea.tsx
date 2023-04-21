import { FC } from 'react';
import ParsonsDropAreaSide from './ParsonsDropAreaSide';
import { ParsonsUiItem, Settings } from '../types';
import ParsonsDropAreaCenter from './ParsonsDropAreaCenter';

export type position = 'left' | 'right' | undefined;
export type dragInfo = {
  dragging: boolean;
  from: position;
  to: position;
};

export type ParsonsDropAreaProps = {
  title: string;
  position: position;
  list: ParsonsUiItem[];
  setList: (items: ParsonsUiItem[]) => void;
  onChangeItem: (item: ParsonsUiItem) => void;
  showFeedback?: boolean;
  isValid?: boolean;
  settings: Settings;
  setDragInfo: (dragInfo: dragInfo) => void;
  dragInfo: dragInfo;
  numberOfItemForSize: number;
};

export type ParsonsGroupBlock = {
  groupName: string;
  size: number;
};

const ParsonsDropArea: FC<ParsonsDropAreaProps> = ({
  title,
  list,
  ...props
}) => {
  const grouped = list.reduce<ParsonsGroupBlock[]>(
    (accumulator, currentValue, currentIndex, array) => {
      const newValue =
        accumulator.length === 0 ||
        accumulator[accumulator.length - 1].groupName !==
          currentValue.pairedGroupName
          ? { groupName: currentValue.pairedGroupName || '', size: 1 }
          : undefined;

      return newValue
        ? [...accumulator, newValue]
        : [
            ...accumulator.slice(0, -1),
            {
              ...accumulator[accumulator.length - 1],
              size: accumulator[accumulator.length - 1].size + 1,
            },
          ];
    },
    [] //[{groupName: "1", size: 2},{groupName: "2", size: 1}]
  );

  const padding = '2px';

  return (
    <>
      <div className="basis-1/2 text-center">
        <div
          className={`my-1 mx-3 leading-9 ${
            props.showFeedback && props.isValid ? 'font-medium' : ''
          }`}
        >
          {props.showFeedback === false || props.isValid === undefined
            ? title
            : props.isValid === true
            ? 'Congratulations, your solution is valid!'
            : 'Your solution is not yet valid'}
        </div>
        <div className={`grid grid-cols-[25px_minmax(0,_1fr)_10px]`}>
          <ParsonsDropAreaSide
            grouped={props.position === 'left' ? grouped : undefined}
            side="left"
            padding={padding}
          />
          <ParsonsDropAreaCenter title={title} list={list} {...props} />
          <ParsonsDropAreaSide
            grouped={props.position === 'left' ? grouped : undefined}
            side="right"
            padding={padding}
          />
        </div>
      </div>
    </>
  );
};

export default ParsonsDropArea;
