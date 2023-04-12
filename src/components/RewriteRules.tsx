import { FC } from 'react';
import { rules, ruleTranslations } from '../logEx/rules';
import { ParsonsUiItem } from '../types';
import CaretDownIcon from './CaretDownIcon';
import RewriteRuleDivider from './RewriteRuleDivider';

interface Props {
  list: ParsonsUiItem[];
  onChangeRule: (item: ParsonsUiItem, newRule: string) => void;
  showFeedback: boolean;
}

const RewriteRules: FC<Props> = ({ list, onChangeRule, showFeedback }) => {
  return (
    <div className="inner">
      {list.slice(1).map((item, x) => {
        const showFeedbackClassName = `${item.isValidRule === 'green' || item.isValidRule === 'yellow'
          ? 'bg-[#DFF2BF]'
          : item.isValidRule === 'red'
            ? 'bg-[#FFBABA]'
            : 'bg-slate-100'
          }`;
        return (
          <div
            key={x}
            style={{
              position: 'absolute',
              top: `${-82 + (2 + x) * 62}px`,
              display: 'block',
              width: 'calc(100% - 9px)',
              padding: '0 20px 0 20px',
            }}
          >
            <RewriteRuleDivider position="left" status={(!showFeedback ? "unknown" : item.isValidRule)} />
            <RewriteRuleDivider position="right" status={(!showFeedback ? "unknown" : item.isValidRule)} />
            <div className="rule-block">
              <div
                className="dropdown dropdown-end w-full"
                style={{ top: '-3px' }}
              >
                <label
                  tabIndex={0}
                  className={`btn btn-primary btn-xs w-full m-0 p-0 normal-case top-[2px] relative truncate font-sans border-0 text-right ${showFeedback ? showFeedbackClassName : 'bg-slate-100'}`}
                >
                  {item.rule
                    ? // @ts-ignore
                    ruleTranslations['en'][item.rule]
                    : '-- Select rule --'}
                  <CaretDownIcon />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 font-sans text-sm relative top-[27px]"
                >
                  {rules.map((i, x) => (
                    <li key={x * 100}>
                      <a
                        onClick={() => onChangeRule(item, i)}
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
        );
      })}
    </div>
  );
};

export default RewriteRules;
