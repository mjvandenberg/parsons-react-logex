import { FC } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ItemType } from '../types';
import ParsonsBlock from './ParsonsBlock';
import * as R from 'ramda';
import ParsonsDropAreaSide from './ParsonsDropAreaSide';

type Props = {
  title: string;
  position?: 'left' | 'right';
  list: ItemType[];
  setList: (items: ItemType[]) => void;
};

const ParsonsDropArea: FC<Props> = ({
  title,
  list,
  setList,
  position = 'left',
}) => {
  const grouped = R.groupBy<ItemType>((i) => i.pairedGroupName ?? '')(list);

  const classLeft = 'bg-[#efefff]';
  const classRight = 'bg-[#ffffaa]';

  return (
    <>
      {false && (
        <pre style={{ textAlign: 'left' }}>
          {JSON.stringify(Object.keys(grouped), null, '\t')}
        </pre>
      )}
      <div className="basis-1/2">
        <div className="my-1 mx-3 leading-9">{title}</div>
        <div className={`grid grid-cols-[25px_minmax(0,_1fr)_10px]`}>
          <ParsonsDropAreaSide grouped={grouped} side="left" />
          <div
            className={`flex flex-col border border-indigo-200 min-h-[40px] ${
              position === 'left' ? classLeft : classRight
            }`}
          >
            {list
              .filter((i) => i.isStaticFirst)
              .map((item) => (
                <ParsonsBlock
                  key={item.id}
                  text={item.text}
                  isStatic={true}
                  isFirst={true}
                  isGrouped={item.groupName !== undefined}
                />
              ))}
            <ReactSortable
              className={`min-h-[40px]`}
              tag="div"
              list={list}
              setList={setList}
              group="p"
            >
              {list
                .filter((i) => !i.isStaticFirst && !i.isStaticLast)
                .map((item) => (
                  <ParsonsBlock
                    key={item.id}
                    text={item.text}
                    isStatic={false}
                    isFirst={false}
                    isGrouped={item.groupName !== undefined}
                  />
                ))}
            </ReactSortable>
          </div>
          <ParsonsDropAreaSide grouped={grouped} side="right" />
        </div>
      </div>
    </>
  );
};

export default ParsonsDropArea;
