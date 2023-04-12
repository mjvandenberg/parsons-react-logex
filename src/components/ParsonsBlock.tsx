import { FC } from 'react';
import { Rule } from '../logEx/rules';
import { ParsonsUiItem } from '../types';

interface ParsonsBlockProps {
  isStatic?: boolean;
  item: ParsonsUiItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  totalItems: number;
  position: 'left' | 'right';
  showFeedback: boolean;
}

const ParsonsBlock: FC<ParsonsBlockProps> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
  totalItems = 2,
  position,
  showFeedback,
}) => {
  const defaultClassName = `parsons-block katex relative text-left pl-2 leading-9 rounded-lg border border-[#D3D3D3] select-none static bg-slate-200 ${
    totalItems === 2 ? 'mt-1' : position === 'left' || isFirst ? 'mt-1' : `mt-1`
  }`;

  const showFeedbackClassName = `${
    item.isValid === 'green' || item.isValid === 'yellow'
      ? 'border-[#008000] bg-[#DFF2BF] '
      : item.isValid === 'red'
      ? 'border-[#ff0000] bg-[#FFBABA] '
      : ''
  }`;

  return (
    <div
      className={`${defaultClassName} ${
        showFeedback ? showFeedbackClassName : ''
      }${isStatic ? 'filtered' : 'cursor-move'} ${isGrouped ? '' : ''}`}
    >
      <span
        className={`katex float-left relative left-[0px] top-[3px] ${
          position === 'left'
            ? 'invisible'
            : isFirst && position === 'right'
            ? 'invisible'
            : ''
        }`}
      >
        ⇔
      </span>
      <span
        className={`${
          position === 'left' ? 'ml-[-20px]' : 'ml-5'
        } ineline-block`}
      >
        {item.text}
      </span>
      {position === 'right' && (!isFirst || !isStatic) && <></>}
    </div>
  );
};

export default ParsonsBlock;
