import { FC } from 'react';
import { ReactSortable } from 'react-sortablejs';
import CaretDownIcon from './CaretDownIcon';
import ParsonsBlock from './ParsonsBlock';
import { ParsonsDropAreaProps } from './ParsonsDropArea';
import { Rule, rules, ruleTranslations } from '../logEx/rules';

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

  const handleOnChangeRule: (newRule: string) => void = (newRule) => {
    // @ts-ignore
    document?.activeElement?.blur();
  };

  return (
    <div
      id={position}
      className={`flex flex-col border outer ${
        isValid === undefined
          ? 'border-indigo-200'
          : isValid === true
          ? 'border-[#008000]'
          : 'border-[#ff0000]'
      } min-h-[40px] pb-1 px-1 ${position === 'left' ? classLeft : classRight}`}
    >
      {position === 'right' && (
        <div className="inner">
          {list.slice(1).map((item, x) => (
            <div
              style={{
                position: 'absolute',
                top: `${-82 + (2 + x) * 62}px`,
                display: 'block',
                width: 'calc(100% - 9px)',
                padding: '0 20px 0 20px',
              }}
            >
              <div className="new-rule">
                <div
                  className="dropdown dropdown-end w-full"
                  style={{ top: '-3px' }}
                >
                  <label
                    tabIndex={0}
                    className="btn btn-primary btn-xs w-full m-0 p-0 normal-case top-[2px] relative truncate font-sans bg-white text-right"
                  >
                    {/*item.rule
                      ? // @ts-ignore
                        ruleTranslations['en'][item.rule]
                    : '-- Select rule --'*/}
                    -- Select rule -- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <CaretDownIcon />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 font-sans text-sm relative top-[35px]"
                  >
                    {rules.map((i, x) => (
                      <li>
                        <a
                          onClick={() => handleOnChangeRule(i)}
                          className="leading-none"
                        >
                          {ruleTranslations['en'][i]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ReactSortable
        className={`w-full leading-[37px] select-none parsons-drop-area-${position} ${
          position === 'left' && classLeftSortable
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
            <>
              <ParsonsBlock
                key={item.id}
                item={item}
                isStatic={
                  position === 'right' && (x === 0 || x === list.length - 1)
                }
                isFirst={x === 0}
                isLast={x == list.length - 1}
                totalItems={list.length}
                isGrouped={item.groupName !== undefined}
                onChangeItem={onChangeItem}
                position={position!}
                showFeedback={showFeedback!}
              />
              {false && position === 'right' && x < list.length - 1 && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-primary btn-sm m-1 normal-case top-[2px] relative max-w-[550px] min-w-[150px] truncate font-sans bg-white text-right"
                  >
                    {item.rule
                      ? // @ts-ignore
                        ruleTranslations['en'][item.rule]
                      : '-- Select rule --'}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <CaretDownIcon />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 font-sans text-sm relative top-[35px]"
                  >
                    {rules.map((i, x) => (
                      <li>
                        <a
                          onClick={() => handleOnChangeRule(i)}
                          className="leading-none"
                        >
                          {ruleTranslations['en'][i]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ))
        )}
      </ReactSortable>
    </div>
  );
};

export default ParsonsDropAreaCenter;
