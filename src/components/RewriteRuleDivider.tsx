import { FC, useEffect, useState } from 'react';
import {
  GetFeedbackStyle,
  ParsonsStatus,
  ParsonsUiItem,
  Settings,
} from '../types';
import {
  getFeedbackStyleRewriteRuleDividerDefault,
  getFeedbackStyleRewriteRuleDividerOnlyInvalidItems,
} from './feedback';

interface Props {
  position: 'left' | 'right';
  item: ParsonsUiItem;
  showFeedback: boolean;
  settings: Settings;
}

const getFeedbackStyleRewriteRuleDivider: (
  settings: Settings
) => GetFeedbackStyle = (settings) => {
  if (settings.markInvalidItems) {
    return getFeedbackStyleRewriteRuleDividerDefault;
  }
  return getFeedbackStyleRewriteRuleDividerOnlyInvalidItems;
};

const RewriteRuleDivider: FC<Props> = ({
  position,
  item,
  showFeedback,
  settings,
}) => {
  const [feedbackStyle, setFeedbackStyle] = useState<string>();

  useEffect(() => {
    const newStyle = getFeedbackStyleRewriteRuleDivider(settings)(
      showFeedback,
      item
    );
    setFeedbackStyle(newStyle);
  }, [getFeedbackStyleRewriteRuleDivider, settings, item, showFeedback]);

  return (
    <svg
      width="32"
      height="32"
      style={{
        position: 'absolute',
        [position]: '10px',
        display: 'block',
        zIndex: '15',
        transform: position === 'right' ? `scale(-1, 1.1)` : 'scale(1.1)',
      }}
      strokeWidth="0.7"
      stroke={feedbackStyle}
    >
      <circle cx="15" cy="12.2" fill="#ffffaa" r="11" />
      <rect
        y="1.5"
        x="0"
        width="16"
        height="21.5"
        style={{
          fill: '#ffffaa',
          strokeWidth: 0,
          stroke: '#000',
        }}
      />
    </svg>
  );
};

export default RewriteRuleDivider;
