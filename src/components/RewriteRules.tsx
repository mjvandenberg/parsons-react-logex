import { FC } from 'react';
import { ParsonsUiItem, Settings } from '../types';
import RewriteRule from './RewriteRule';

interface Props {
  list: ParsonsUiItem[];
  onChangeRule: (item: ParsonsUiItem, newRule: string) => void;
  showFeedback: boolean;
  settings: Settings;
  drawOneMore: boolean;
  drawOneLess: boolean;
  isDragging: boolean;
}

const RewriteRules: FC<Props> = ({
  list,
  onChangeRule,
  showFeedback,
  settings,
  drawOneMore,
  drawOneLess,
  isDragging,
}) => {
  return (
    <div className="inner">
      {list.slice(drawOneLess ? 2 : 1).map((item, x) => {
        return (
          <RewriteRule
            key={x}
            x={x}
            item={item}
            onChangeRule={onChangeRule}
            showFeedback={showFeedback}
            settings={settings}
            isDragging={isDragging}
          />
        );
      })}
      {drawOneMore && (
        <RewriteRule
          x={list.length - 1}
          item={{ ...list[0], rule: undefined }}
          onChangeRule={onChangeRule}
          showFeedback={showFeedback}
          settings={settings}
          isDragging={isDragging}
        />
      )}
    </div>
  );
};

export default RewriteRules;
