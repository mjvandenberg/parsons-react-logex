import { FC, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ParsonsBlock from './ParsonsBlock';
import { ParsonsDropAreaProps } from './ParsonsDropArea';
import { ParsonsUiItem } from '../types';
import RewriteRules from './RewriteRules';

const ParsonsDropAreaCenter: FC<ParsonsDropAreaProps> = ({
  position,
  list,
  setList,
  onChangeItem,
  showFeedback,
  isValid,
  settings,
  setDragInfo,
  dragInfo,
  numberOfItemForSize,
}) => {
  const [isChoosen, setIsChoosen] = useState<boolean>(false);

  const classLeft = 'bg-[#efefff]';
  const classLeftSortable = 'min-h-[42px]';
  const classRight = 'bg-[#ffffaa]';

  const handleOnChangeRule: (item: ParsonsUiItem, newRule: string) => void = (
    item,
    newRule
  ) => {
    onChangeItem({
      ...item,
      rule: newRule === '' ? undefined : newRule,
    });
    // @ts-ignore
    document?.activeElement?.blur();
  };

  const handleOnStart = (evt: any) => {
    setDragInfo({
      ...dragInfo,
      dragging: true,
      from: position,
    });
  };

  const handleOnEnd = (evt: any) => {
    setDragInfo({
      dragging: false,
      from: undefined,
      to: undefined,
    });
  };

  const handleOnChange = (evt: any) => {
    setDragInfo({
      ...dragInfo,
      to: evt.to.id.split('_')[1],
    });
  };

  return (
    <div
      id={position}
      className={`flex flex-col border outer ${
        isValid === undefined
          ? 'border-indigo-200'
          : isValid === true
          ? 'border-[#008000] drop-shadow-green'
          : 'border-[#ff0000]'
      } min-h-[40px] pb-1 px-1 ${position === 'left' ? classLeft : classRight}`}
    >
      {position === 'right' && (
        <RewriteRules
          showFeedback={showFeedback!}
          drawOneMore={
            dragInfo.dragging &&
            dragInfo.from !== position &&
            dragInfo.to === position
          }
          drawOneLess={
            dragInfo.dragging &&
            dragInfo.from === position &&
            dragInfo.to !== position
          }
          isDragging={dragInfo.dragging}
          list={list}
          onChangeRule={handleOnChangeRule}
          settings={settings}
        />
      )}
      <ReactSortable
        id={`sortable_${position}`}
        className={`w-full leading-[37px] select-none parsons-drop-area-${position} ${
          position === 'left' && classLeftSortable
        }`}
        style={{ minHeight: `${numberOfItemForSize * 42}px` }}
        tag="div"
        list={list}
        setList={setList}
        group="p"
        animation={200}
        ghostClass="ghostcls"
        dragClass="dragcls"
        chosenClass="chosencls"
        forceFallback={true}
        onStart={handleOnStart}
        onEnd={handleOnEnd}
        onChange={handleOnChange}
        filter={'.filtered'}
      >
        {position === 'right' && list.length === 0 ? (
          <></>
        ) : (
          list.map((item, x) => (
            <ParsonsBlock
              key={item.id}
              item={item}
              isStatic={
                false //position === 'right' && (x === 0 || x === list.length - 1)
              }
              isFirst={x === 0}
              totalItems={list.length}
              isGrouped={item.groupName !== undefined}
              position={position!}
              showFeedback={showFeedback!}
              settings={settings}
            />
          ))
        )}
      </ReactSortable>
    </div>
  );
};

export default ParsonsDropAreaCenter;
