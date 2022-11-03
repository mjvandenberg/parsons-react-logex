import { ChangeEventHandler, FC } from 'react';
import { Rule, rules, ruleTranslations } from '../logEx/rules';
import { ParsonsItem } from '../types';

interface Props {
  isStatic?: boolean;
  item: ParsonsItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  onChangeItem: (item: ParsonsItem) => void;
  position: 'left' | 'right';
  showFeedback: boolean;
  isBlockPositionValid?: boolean;
  isRuleValid?: boolean;
}

const ParsonsBlock: FC<Props> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
  onChangeItem,
  position,
  showFeedback,
  isBlockPositionValid,
  isRuleValid,
}) => {
  const handleOnChangeRule: ChangeEventHandler<HTMLSelectElement> = ({
    target,
  }) => {
    onChangeItem({
      ...item,
      rule: target.value === '' ? undefined : target.value,
    });
  };

  const defaultClassName =
    'katex z-1 relative text-left pl-2 leading-9 rounded-lg border border-[#D3D3D3] select-none mt-1 static bg-slate-200';

  const showFeedbackClassName = `${
    isBlockPositionValid === true
      ? 'border-[#00ff00] bg-[#00ff00]/100 '
      : isBlockPositionValid === false
      ? 'border-[#ff0000] bg-[#ff0000]/100 '
      : ''
  }`;

  const showFeedbackRuleClassName = `${
    isRuleValid === true
      ? 'select-success '
      : isRuleValid === false
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
        <select
          onChange={handleOnChangeRule}
          value={item.rule ? item.rule : ''}
          className={`select select-bordered select-sm  max-w-xs bg-gray-50 ${
            showFeedback ? showFeedbackRuleClassName : ''
          } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 mt-[1px] mr-[1px] float-right font-light`}
        >
          <option translate-key="shared.button.selectRule" value="">
            -- Select rule --
          </option>
          {rules.map((i, x) => (
            <option key={x} value={i}>
              {ruleTranslations['en'][i]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ParsonsBlock;
