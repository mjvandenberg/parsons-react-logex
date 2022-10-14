import { FC } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ParsonsBlock from './ParsonsBlock';
import ParsonsDropAreaSide from './ParsonsDropAreaSide';
import { ParsonsItem } from '../types';
import { groupBy } from '../array';
import { createTrue } from 'typescript/lib/tsserverlibrary';
import { transformWithEsbuild } from 'vite';

type Props = {
  title: string;
  position?: 'left' | 'right';
  list: ParsonsItem[];
  setList: (items: ParsonsItem[]) => void;
  onChangeItem: (item: ParsonsItem) => void;
  showFeedback?: boolean;
  exerciseSolution?: ParsonsItem[];
};

const ParsonsDropArea: FC<Props> = ({
  title,
  list,
  setList,
  position = 'left',
  onChangeItem,
  showFeedback = false,
  exerciseSolution = [],
}) => {
  const grouped = groupBy<ParsonsItem, string>(
    list,
    (i) => i.pairedGroupName ?? ''
  );

  const classLeft = 'bg-[#efefff]';
  const classLeftSortable = 'min-h-[42px]';
  const classRight = 'bg-[#ffffaa]';
  const padding = '2px';

  const hasStaticFirst = list.findIndex((i) => i.isStaticFirst === true) > -1;

  return (
    <>
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
          <ParsonsDropAreaSide
            grouped={grouped}
            side="left"
            padding={padding}
          />
          <div
            className={`flex flex-col border border-indigo-200 min-h-[40px] pb-1 px-1 ${
              position === 'left' ? classLeft : classRight
            }`}
          >
            {hasStaticFirst &&
              list
                .filter((i) => i.isStaticFirst)
                .map((item) => (
                  <ParsonsBlock
                    key={item.id}
                    item={item}
                    isStatic={true}
                    isFirst={true}
                    isGrouped={item.groupName !== undefined}
                    onChangeItem={onChangeItem}
                    position={position}
                    showFeedback={showFeedback}
                    isBlockPositionValid={
                      exerciseSolution.at(0)!.text === item.text
                    }
                    isRuleValid={true}
                  />
                ))}
            <ReactSortable
              className={`w-full leading-[37px] select-none ${
                position === 'left' && classLeftSortable
              }`}
              tag="div"
              list={list}
              setList={setList}
              group="p"
            >
              {position === 'right' &&
              list.filter((i) => !i.isStaticFirst && !i.isStaticLast).length ===
                0 ? (
                <></>
              ) : (
                list
                  .filter((i) => !i.isStaticFirst && !i.isStaticLast)
                  .map((item, x) => (
                    <ParsonsBlock
                      key={item.id}
                      item={item}
                      isStatic={false}
                      isFirst={!hasStaticFirst && x === 0}
                      isGrouped={item.groupName !== undefined}
                      onChangeItem={onChangeItem}
                      position={position}
                      showFeedback={showFeedback}
                      isBlockPositionValid={false}
                      isRuleValid={true}
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
                  position={position}
                  showFeedback={showFeedback}
                  isBlockPositionValid={false}
                  isRuleValid={true}
                />
              ))}
          </div>
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
