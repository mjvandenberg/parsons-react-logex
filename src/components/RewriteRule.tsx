import { FC, useEffect, useState } from 'react';
import { rules, ruleTranslations } from '../logEx/rules';
import { GetFeedbackStyle, ParsonsUiItem, Settings } from '../types';
import CaretDownIcon from './CaretDownIcon';
import {
  getFeedbackStyleRewriteRuleDefault,
  getFeedbackStyleRewriteRuleOnlyInvalidItems,
} from './feedback';
import RewriteRuleDivider from './RewriteRuleDivider';

interface Props {
  item: ParsonsUiItem;
  onChangeRule: (item: ParsonsUiItem, newRule: string) => void;
  showFeedback: boolean;
  settings: Settings;
  x: number;
  isDragging: boolean;
}

const getFeedbackStyleRewriteRule: (settings: Settings) => GetFeedbackStyle = (
  settings
) => {
  if (settings.markInvalidItems) {
    return getFeedbackStyleRewriteRuleDefault;
  }
  return getFeedbackStyleRewriteRuleOnlyInvalidItems;
};

const RewriteRule: FC<Props> = ({
  item,
  onChangeRule,
  showFeedback,
  settings,
  x,
  isDragging,
}) => {
  const [feedbackStyle, setFeedbackStyle] = useState<string>();

  useEffect(() => {
    const newStyle = getFeedbackStyleRewriteRule(settings)(showFeedback, item);
    setFeedbackStyle(newStyle);
  }, [getFeedbackStyleRewriteRule, settings, item, showFeedback]);

  return (
    <div className="inner">
      <div
        style={{
          position: 'absolute',
          top: `${(2 + x) * 61.7 - 82.5}px`,
          display: 'block',
          width: 'calc(100% - 9px)',
          padding: '0 20px 0 20px',
          //backgroundColor: 'red',
          height: '26px',
          zIndex: 900,
          //borderTop: '1px solid red'
          //overflow: 'hidden',
        }}
      >
        {false && (
          <RewriteRuleDivider
            position="left"
            showFeedback={isDragging === false && showFeedback}
            item={item}
            settings={settings}
          />
        )}
        {false && (
          <RewriteRuleDivider
            position="right"
            showFeedback={isDragging === false && showFeedback}
            item={item}
            settings={settings}
          />
        )}
        <div
          className={`rule-block ${
            isDragging === false && showFeedback
              ? feedbackStyle
              : 'bg-slate-100'
          }`}
          style={{
            borderTop: '1px solid blue',
            borderBottom: '1px solid blue',
            borderLeft: '1px solid blue',
            borderRight: '1px solid blue',
          }}
        >
          <div
            className="dropdown dropdown-end w-full"
            style={{ top: '0px', height: '24px' }}
          >
            <label
              tabIndex={0}
              className={`btn btn-secondary no-animation rounded-none btn-xs w-full bg-transparent m-0 p-0 normal-case top-[0px] relative truncate font-sans border-0 text-right ${
                settings.autoFillRewriteRules
                  ? 'cursor-default hover:bg-transparent'
                  : 'hover:bg-transparent'
              }`}
            >
              {item.rule
                ? // @ts-ignore
                  ruleTranslations['en'][item.rule]
                : settings.autoFillRewriteRules
                ? '...'
                : '-- Select rule --'}
              {!settings.autoFillRewriteRules && <CaretDownIcon />}
            </label>
            {!settings.autoFillRewriteRules && (
              <div className="dropdown-content flex flex-row flex-wrap bg-base-100 w-[545px] relative top-[27px] shadow rounded-box p-1">
                {rules.map((i, x) => (
                  <div key={x * 100}>
                    <button
                      onClick={() => onChangeRule(item, i)}
                      className="btn btn-ghost normal-case btn-sm m-[1px] w-[175px]"
                    >
                      {ruleTranslations['en'][i]}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/*!settings.autoFillRewriteRules && (
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
                )*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewriteRule;
