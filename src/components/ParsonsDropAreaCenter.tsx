import { FC } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ParsonsBlock from './ParsonsBlock';
import { ParsonsDropAreaProps } from './ParsonsDropArea';

const ParsonsDropAreaCenter: FC<ParsonsDropAreaProps> = ({
  position,
  list,
  setList,
  onChangeItem,
  showFeedback,
  exerciseSolution,
}) => {
  const classLeft = 'bg-[#efefff]';
  const classLeftSortable = 'min-h-[42px]';
  const classRight = 'bg-[#ffffaa]';
  const hasStaticFirst = list.findIndex((i) => i.isStaticFirst === true) > -1;
  return (
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
              position={position!}
              showFeedback={showFeedback!}
              isBlockPositionValid={exerciseSolution!.at(0)!.text === item.text}
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
        list.filter((i) => !i.isStaticFirst && !i.isStaticLast).length === 0 ? (
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
                position={position!}
                showFeedback={showFeedback!}
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
            position={position!}
            showFeedback={showFeedback!}
            isBlockPositionValid={false}
            isRuleValid={true}
          />
        ))}
    </div>
  );
};

export default ParsonsDropAreaCenter;
