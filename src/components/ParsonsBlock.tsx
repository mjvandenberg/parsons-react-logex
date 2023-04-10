import { ChangeEventHandler, FC } from 'react';
import { Rule, rules, ruleTranslations } from '../logEx/rules';
import { ParsonsUiItem } from '../types';
import CaretDownIcon from './CaretDownIcon';

interface ParsonsBlockProps {
  isStatic?: boolean;
  item: ParsonsUiItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  isLast: boolean;
  totalItems: number;
  onChangeItem: (item: ParsonsUiItem) => void;
  position: 'left' | 'right';
  showFeedback: boolean;
}

const ParsonsBlock: FC<ParsonsBlockProps> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
  isLast = false,
  totalItems = 2,
  onChangeItem,
  position,
  showFeedback,
}) => {
  const handleOnChangeRule: (newRule: string) => void = (newRule) => {
    onChangeItem({
      ...item,
      rule: newRule === '' ? undefined : newRule,
    });
    // @ts-ignore
    document?.activeElement?.blur();
  };
  const margin = 30;

  const defaultClassName = `parsons-block katex relative text-left pl-2 leading-9 rounded-lg border border-[#D3D3D3] select-none static bg-slate-200 ${totalItems === 2 ? 'mt-1' : position === 'left' || isFirst ? 'mt-1' : `mt-1`
    }`;

  const showFeedbackClassName = `${item.isValid === true
    ? 'border-[#008000] bg-[#DFF2BF] '
    : item.isValid === false
      ? 'border-[#ff0000] bg-[#FFBABA] '
      : ''
    }`;

  const showFeedbackRuleClassName = `${item.isValid === true
    ? 'select-success '
    : item.isValid === false
      ? 'select-error '
      : ''
    }`;

  return (
    <div
      className={`${defaultClassName} ${showFeedback ? showFeedbackClassName : ''
        }${isStatic ? 'filtered' : 'cursor-move'} ${isGrouped ? '' : ''}`}
    >
      <span
        className={`katex float-left relative left-[0px] top-[3px] ${position === 'left'
          ? 'invisible'
          : isFirst && position === 'right'
            ? 'invisible'
            : ''
          }`}
      >
        ⇔
      </span>
      <span
        className={`${position === 'left' ? 'ml-[-20px]' : 'ml-5'
          } ineline-block`}
      >
        {item.text}
      </span>
      {position === 'right' && (!isFirst || !isStatic) && <></>}
    </div>
  );
};

export default ParsonsBlock;
