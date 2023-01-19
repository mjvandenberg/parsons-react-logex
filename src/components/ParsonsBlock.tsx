import { ChangeEventHandler, FC } from 'react';
import { Rule, rules, ruleTranslations } from '../logEx/rules';
import { ParsonsItem } from '../types';
import CaretDownIcon from './CaretDownIcon';

interface ParsonsBlockProps {
  isStatic?: boolean;
  item: ParsonsItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  onChangeItem: (item: ParsonsItem) => void;
  position: 'left' | 'right';
  showFeedback: boolean;
}

const ParsonsBlock: FC<ParsonsBlockProps> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
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

  const defaultClassName =
    'katex relative text-left pl-2 leading-9 rounded-lg border border-[#D3D3D3] select-none mt-1 static bg-slate-200';

  const showFeedbackClassName = `${
    item.isValid === true
      ? 'border-[#008000] bg-[#DFF2BF] '
      : item.isValid === false
      ? 'border-[#ff0000] bg-[#FFBABA] '
      : ''
  }`;

  const showFeedbackRuleClassName = `${
    item.isValid === true
      ? 'select-success '
      : item.isValid === false
      ? 'select-error '
      : ''
  }`;

  return (
    <div
      className={`${defaultClassName} ${
        showFeedback ? showFeedbackClassName : ''
      }${isStatic ? '' : 'cursor-move'} ${isGrouped ? '' : ''}`}
    >
      <span
        className={`katex float-left relative left-[0px] top-[3px] ${
          isFirst && position === 'right' ? 'invisible' : ''
        }`}
      >
        ⇔
      </span>
      <span className="ml-5 ineline-block">{item.text}</span>
      {(!isFirst || !isStatic) && (
        <div className="dropdown dropdown-end static">
          <label
            tabIndex={0}
            className="btn btn-primary btn-xs m-1 normal-case right-[3px] top-[3px] absolute max-w-[150px] truncate font-sans"
          >
            {item.rule
              ? // @ts-ignore
                ruleTranslations['en'][item.rule]
              : 'Select rule'}
            <CaretDownIcon />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 font-sans text-xs relative top-[35px]"
          >
            {rules.map((i, x) => (
              <li>
                <a
                  onClick={() => handleOnChangeRule(i)}
                  className="leading-none"
                >
                  {ruleTranslations['en'][i]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParsonsBlock;
