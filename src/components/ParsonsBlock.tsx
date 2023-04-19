import { FC, useEffect, useState } from 'react';
import { Rule } from '../logEx/rules';
import { GetFeedbackStyle, ParsonsUiItem, Settings } from '../types';
import {
  getFeedbackStyleBlockDefault,
  getFeedbackStyleBlockOnlyInvalidItems,
} from './feedback';

interface ParsonsBlockProps {
  isStatic?: boolean;
  item: ParsonsUiItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  totalItems: number;
  position: 'left' | 'right';
  showFeedback: boolean;
  settings: Settings;
}

const getFeedbackStyle: (settings: Settings) => GetFeedbackStyle = (
  settings
) => {
  if (settings.markInvalidItems) {
    return getFeedbackStyleBlockDefault;
  }
  return getFeedbackStyleBlockOnlyInvalidItems;
};

const ParsonsBlock: FC<ParsonsBlockProps> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
  totalItems = 2,
  position,
  showFeedback,
  settings,
}) => {
  const defaultClassName = `parsons-block katex relative text-left pl-2 leading-9 rounded-lg border select-none static ${
    totalItems === 2 ? 'mt-1' : position === 'left' || isFirst ? 'mt-1' : `mt-1`
  }`;

  const [feedbackStyle, setFeedbackStyle] = useState<string>();

  useEffect(() => {
    const newStyle = getFeedbackStyle(settings)(showFeedback, item);
    setFeedbackStyle(newStyle);
  }, [getFeedbackStyle, settings, item, showFeedback]);

  return (
    <div
      className={`${defaultClassName} ${feedbackStyle}${
        isStatic ? 'filtered' : 'cursor-move'
      } ${isGrouped ? '' : ''}`}
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
