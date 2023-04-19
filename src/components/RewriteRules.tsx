import { FC } from 'react';
import { ParsonsUiItem, Settings } from '../types';
import RewriteRule from './RewriteRule';

interface Props {
  list: ParsonsUiItem[];
  onChangeRule: (item: ParsonsUiItem, newRule: string) => void;
  showFeedback: boolean;
  settings: Settings;
}

const RewriteRules: FC<Props> = ({
  list,
  onChangeRule,
  showFeedback,
  settings,
}) => {
  return (
    <div className="inner">
      {list.slice(1).map((item, x) => {
        return (
          <RewriteRule
            key={x}
            x={x}
            item={item}
            onChangeRule={onChangeRule}
            showFeedback={showFeedback}
            settings={settings}
          />
        );
      })}
    </div>
  );
};

export default RewriteRules;
