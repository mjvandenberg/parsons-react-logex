import { FC } from 'react';

interface Props {
  isStatic?: boolean;
  text: string;
  isGrouped: boolean;
}

const ParsonsBlock: FC<Props> = ({
  text,
  isStatic = false,
  isGrouped = false,
}) => {
  return (
    <div
      className={`katex z-50 relative text-center pl-2 mb-1 leading-9 rounded-lg border border-[#D3D3D3] select-none ${
        isStatic ? 'static bg-slate-200/75 ' : 'cursor-move '
      } ${isGrouped ? 'bg-slate-200' : 'bg-slate-200 '}`}
    >
      {text}
    </div>
  );
};

export default ParsonsBlock;
