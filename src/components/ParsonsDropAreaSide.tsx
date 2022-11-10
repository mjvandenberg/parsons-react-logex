import { FC } from 'react';
import { ParsonsItem } from '../types';

type Props = {
  grouped: Record<string, ParsonsItem[]>;
  side: 'left' | 'right';
  padding: string;
};

const ParsonsDropAreaSide: FC<Props> = ({ grouped, side, padding }) => {
  const classGrouped = 'bg-indigo-300 relative z-0';
  const classLeftGrouped = 'rounded-l-lg left-[2px]';
  const classRightGrouped = 'rounded-r-lg left-[-11px]';

  const classLeft = 'flex w-[32px]';
  const classRight = 'flex w-[12px]';

  return (
    <div
      className={`flex flex-col w-full border border-red-500/0 p-[${padding}]`}
    >
      {Object.keys(grouped).map((i, x) => (
        <div
          key={x}
          style={{
            height: `${38 * grouped[i].length + (grouped[i].length - 1) * 4}px`,
          }}
          className={`${x === 0 ? '' : ' '}${
            side === 'left' ? classLeft : classRight
          } ${
            grouped[i].length > 1
              ? `${classGrouped} ${
                  side === 'left' ? classLeftGrouped : classRightGrouped
                }`
              : ''
          } mt-1`}
        >
          {grouped[i].length > 1 && side === 'left' && (
            <span className="relative top-[28px] left-[7px] text-sm text-indigo-600 font-medium select-none">
              or
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParsonsDropAreaSide;
