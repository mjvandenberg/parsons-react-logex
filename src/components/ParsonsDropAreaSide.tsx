import { FC } from 'react';
import { ParsonsItem } from '../types';

type Props = {
  grouped: Record<string, ParsonsItem[]>;
  side: 'left' | 'right';
};

const ParsonsDropAreaSide: FC<Props> = ({ grouped, side }) => {
  const classGrouped = 'bg-indigo-300 relative top-[2px] z-0';
  const classLeftGrouped = 'rounded-l-lg left-[0px]';
  const classRightGrouped = 'rounded-r-lg left-[-7px]';

  const classLeft = 'flex mb-[4px] w-[32px]';
  const classRight = 'flex mb-[4px] w-[12px]';

  return (
    <div className="flex flex-col w-full">
      {Object.keys(grouped).map((i, x) => (
        <div
          key={x}
          style={{
            height: `${
              38 * grouped[i].length +
              (grouped[i].length - 1) * 3 -
              (grouped[i].length > 1 ? 1 : 0)
            }px`,
          }}
          className={`${side === 'left' ? classLeft : classRight} ${
            grouped[i].length > 1
              ? `${classGrouped} ${
                  side === 'left' ? classLeftGrouped : classRightGrouped
                }`
              : ''
          }`}
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
