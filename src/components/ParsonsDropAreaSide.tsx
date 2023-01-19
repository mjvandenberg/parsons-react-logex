import { FC } from 'react';
import { ParsonsItem } from '../types';
import { ParsonsGroupBlock } from './ParsonsDropArea';

type Props = {
  grouped?: ParsonsGroupBlock[];
  side: 'left' | 'right';
  padding: string;
};

const ParsonsDropAreaSide: FC<Props> = ({ grouped, side, padding }) => {
  const classGrouped = 'bg-indigo-300 relative';
  const classLeftGrouped = 'rounded-l-lg left-[2px]';
  const classRightGrouped = 'rounded-r-lg left-[-11px]';

  const classLeft = 'flex w-[32px]';
  const classRight = 'flex w-[6px]';

  return (
    <div
      className={`flex flex-col w-full border border-red-500/0 p-[${padding}]`}
    >
      {grouped &&
        grouped.map(({ size }, x) => (
          <div
            key={x}
            style={{
              height: `${38 * size + (size - 1) * 4}px`,
            }}
            className={`${x === 0 ? '' : ' '}${
              side === 'left' ? classLeft : classRight
            } ${
              size > 1
                ? `${classGrouped} ${
                    side === 'left' ? classLeftGrouped : classRightGrouped
                  }`
                : ''
            } mt-1`}
          >
            {size > 1 && side === 'left' && (
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
