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
        top: '0px',
        display: 'block',
        zIndex: '15',
        transform: position === 'right' ? `scale(-1, 1.0)` : 'scale(1.0)',
      }}
      strokeWidth="0.9"
      stroke={feedbackStyle}
    >
      <circle cx="15" cy="13" fill="#ffffaa" r="12.6" />
      <rect
        y="1"
        x="0"
        width="15"
        height="24"
        style={{
          fill: '#ffffaa',
          strokeWidth: 0,
          stroke: '#000',
        }}
      />
      <rect
        y="0"
        x="10"
        width="12"
        height="1"
        style={{
          fill: '#0000ff',
          strokeWidth: 0,
          stroke: '#000',
        }}
      />
    </svg>
  );
};

export default RewriteRuleDivider;
