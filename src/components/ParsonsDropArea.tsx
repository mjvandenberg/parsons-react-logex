import { FC } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ParsonsBlock from './ParsonsBlock';
import ParsonsDropAreaSide from './ParsonsDropAreaSide';
import { ParsonsItem } from '../types';

type Props = {
  title: string;
  position?: 'left' | 'right';
  list: ParsonsItem[];
  setList: (items: ParsonsItem[]) => void;
  onChangeItem: (item: ParsonsItem) => void;
};

const ParsonsDropArea: FC<Props> = ({
  title,
  list,
  setList,
  position = 'left',
  onChangeItem,
}) => {
  const grouped = R.groupBy<ParsonsItem>((i) => i.pairedGroupName ?? '')(list);

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
        {false && (
          <pre style={{ textAlign: 'left' }}>
            {JSON.stringify(
              list.map((i) => i.rule),
              null,
              '\t'
            )}
          </pre>
        )}
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
                  item={item}
                  isStatic={true}
                  isFirst={true}
                  isGrouped={item.groupName !== undefined}
                  onChangeItem={onChangeItem}
                />
              ))}
            <ReactSortable
              className={`min-h-[40px] leading-[37px] select-none`}
              tag="div"
              list={list}
              setList={setList}
              group="p"
            >
              {position === 'right' &&
              list.filter((i) => !i.isStaticFirst && !i.isStaticLast).length ===
                0 ? (
                <>Drop here</>
              ) : (
                list
                  .filter((i) => !i.isStaticFirst && !i.isStaticLast)
                  .map((item) => (
                    <ParsonsBlock
                      key={item.id}
                      item={item}
                      isStatic={false}
                      isFirst={false}
                      isGrouped={item.groupName !== undefined}
                      onChangeItem={onChangeItem}
                    />
                  ))
              )}
            </ReactSortable>
            {list
              .filter((i) => i.isStaticLast)
              .map((item) => (
                <ParsonsBlock
                  key={item.id}
                  item={item}
                  isStatic={true}
                  isFirst={false}
                  isGrouped={item.groupName !== undefined}
                  onChangeItem={onChangeItem}
                />
              ))}
          </div>
          <ParsonsDropAreaSide grouped={grouped} side="right" />
        </div>
      </div>
    </>
  );
};

export default ParsonsDropArea;
