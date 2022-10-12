import { FC } from 'react';

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
  return (
    <div
      className={`katex z-50 relative text-center pl-2 mb-1 leading-9 rounded-lg border border-[#D3D3D3] select-none ${
        isStatic ? 'static bg-slate-200/75 ' : 'cursor-move '
      } ${isGrouped ? 'bg-slate-200' : 'bg-slate-200 '}`}
    >
      {!isFirst && (
        <span className="katex float-left relative left-[0px] top-[3px]">
          ⇔
        </span>
      )}
      {text}
    </div>
  );
};

export default ParsonsBlock;
