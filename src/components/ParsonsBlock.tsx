import { ChangeEventHandler, FC, useState } from 'react';
import { Rule, rules, ruleTranslations } from '../logEx/rules';
import { ParsonsItem } from '../types';

interface Props {
  isStatic?: boolean;
  item: ParsonsItem;
  rule?: Rule;
  isGrouped: boolean;
  isFirst: boolean;
  onChangeItem: (item: ParsonsItem) => void;
}

const ParsonsBlock: FC<Props> = ({
  item,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
  onChangeItem,
  ...props
}) => {
  const handleOnChangeRule: ChangeEventHandler<HTMLSelectElement> = ({
    target,
  }) => {
    onChangeItem({
      ...item,
      rule: target.value === '' ? undefined : target.value,
    });
  };

  return (
    <div
      className={`katex z-50 relative text-left pl-2 mb-1 leading-9 rounded-lg border border-[#D3D3D3] select-none ${
        isStatic ? 'static bg-slate-200/75 ' : 'cursor-move '
      } ${isGrouped ? 'bg-slate-200' : 'bg-slate-200 '}`}
    >
      <span
        className={`katex float-left relative left-[0px] top-[3px] ${
          isFirst && 'invisible'
        }`}
      >
        ⇔
      </span>
      <span className="ml-5 ineline-block">{item.text}</span>
      {!isFirst && (
        <select
          onChange={handleOnChangeRule}
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 mt-[1px] float-right"
        >
          <option translate-key="shared.button.selectRule" value="">
            -- Select rule --
          </option>
          {rules.map((i, x) => (
            <option key={x} value={i} selected={item.rule === i}>
              {ruleTranslations['en'][i]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ParsonsBlock;
