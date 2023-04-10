import { FC } from 'react';
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
}) => {
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

  return (
    <div
      id={position}
      className={`flex flex-col border outer ${isValid === undefined
        ? 'border-indigo-200'
        : isValid === true
          ? 'border-[#008000]'
          : 'border-[#ff0000]'
        } min-h-[40px] pb-1 px-1 ${position === 'left' ? classLeft : classRight}`}
    >
      {position === 'right' && (
        <RewriteRules showFeedback={showFeedback!} list={list} onChangeRule={handleOnChangeRule} />
      )}
      <ReactSortable
        className={`w-full leading-[37px] select-none parsons-drop-area-${position} ${position === 'left' && classLeftSortable
          }`}
        tag="div"
        list={list}
        setList={setList}
        group="p"
        animation={200}
        ghostClass="ghostcls"
        dragClass="dragcls"
        chosenClass="chosencls"
        forceFallback={true}
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
            />

          ))
        )}
      </ReactSortable>
    </div>
  );
};

export default ParsonsDropAreaCenter;
