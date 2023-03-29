import { FC } from 'react';
import { rules, ruleTranslations } from '../logEx/rules';
import { ParsonsItem } from '../types';
import CaretDownIcon from './CaretDownIcon';
import RewriteRuleDivider from './RewriteRuleDivider';

interface Props {
  list: ParsonsItem[];
  onChangeRule: (item: ParsonsItem, newRule: string) => void;
}

const RewriteRules: FC<Props> = ({ list, onChangeRule }) => {
  return (
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
          <RewriteRuleDivider position="left" />
          <RewriteRuleDivider position="right" />
          <div className="rule-block">
            <div
              className="dropdown dropdown-end w-full"
              style={{ top: '-3px' }}
            >
              <label
                tabIndex={0}
                className="btn btn-primary btn-xs w-full m-0 p-0 normal-case top-[2px] relative truncate font-sans border-0 bg-slate-100 text-right"
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
                  <li>
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
      ))}
    </div>
  );
};

export default RewriteRules;
