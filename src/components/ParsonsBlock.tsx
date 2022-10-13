import { FC } from 'react';
import Rules from '../logEx/rules';

interface Props {
  isStatic?: boolean;
  text: string;
  isGrouped: boolean;
  isFirst: boolean;
}

const ParsonsBlock: FC<Props> = ({
  text,
  isStatic = false,
  isGrouped = false,
  isFirst = false,
}) => {
  let k: keyof typeof Rules;

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
      <span className="ml-5 ineline-block">{text}</span>

      {!isFirst && (
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 mt-[1px] float-right"
        >
          <option translate-key="shared.button.selectRule">
            -- Select rule --
          </option>
          {Object.keys(Rules).map((i, x) => (
            <option key={x} value={i}>
              {Rules[i as keyof typeof Rules]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ParsonsBlock;
