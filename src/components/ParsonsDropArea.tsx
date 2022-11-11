import { FC } from 'react';
import ParsonsDropAreaSide from './ParsonsDropAreaSide';
import { ParsonsItem } from '../types';
import { groupBy } from '../array';
import ParsonsDropAreaCenter from './ParsonsDropAreaCenter';

export type ParsonsDropAreaProps = {
  title: string;
  position?: 'left' | 'right';
  list: ParsonsItem[];
  setList: (items: ParsonsItem[]) => void;
  onChangeItem: (item: ParsonsItem) => void;
  showFeedback?: boolean;
  exerciseSolution?: ParsonsItem[];
};

const ParsonsDropArea: FC<ParsonsDropAreaProps> = ({
  title,
  list,
  ...props
}) => {
  const grouped = groupBy<ParsonsItem, string>(
    list,
    (i) => i.pairedGroupName ?? ''
  );

  const padding = '2px';

  return (
    <>
      <div className="basis-1/2 text-center">
        <div className="my-1 mx-3 leading-9">{title}</div>
        <div className={`grid grid-cols-[25px_minmax(0,_1fr)_10px]`}>
          <ParsonsDropAreaSide
            grouped={grouped}
            side="left"
            padding={padding}
          />
          <ParsonsDropAreaCenter title={title} list={list} {...props} />
          <ParsonsDropAreaSide
            grouped={grouped}
            side="right"
            padding={padding}
          />
        </div>
      </div>
    </>
  );
};

export default ParsonsDropArea;
