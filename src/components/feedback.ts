import { GetFeedbackStyle } from '../types';

export const neutralStyle = 'border-[#d3d3d3] bg-slate-200 ';
const redStyle = 'border-[#ff0000] bg-[#ffbaba] ';
const greenStyle = 'border-[#008200] bg-[#dff2bf] ';
const yellowStyle = 'border-[#008200] bg-[#dff2bf] ';

export const getFeedbackStyleBlockDefault: GetFeedbackStyle = (
  showFeedback,
  item
) => {
  if (!showFeedback) return neutralStyle;
  switch (item.isValid) {
    case 'red':
      return redStyle;
    case 'green':
      return greenStyle;
    case 'yellow':
      return yellowStyle;
    default:
      return neutralStyle;
  }
};

export const getFeedbackStyleBlockOnlyInvalidItems: GetFeedbackStyle = (
  showFeedback,
  item
) => {
  if (!showFeedback) return neutralStyle;
  switch (item.isValid) {
    case 'red':
      return neutralStyle;
    case 'green':
      return greenStyle;
    case 'yellow':
      return yellowStyle;
    default:
      return neutralStyle;
  }
};

export const getFeedbackStyleRewriteRuleDefault: GetFeedbackStyle = (
  showFeedback,
  item
) => {
  if (!showFeedback) return 'bg-slate-100 ';
  switch (item.isValidRule) {
    case 'red':
      return 'bg-[#ffbaba] ';
    case 'green':
    case 'yellow':
      return 'bg-[#dff2bf] ';
    default:
      return 'bg-slate-100 ';
  }
};

export const getFeedbackStyleRewriteRuleOnlyInvalidItems: GetFeedbackStyle = (
  showFeedback,
  item
) => {
  if (!showFeedback) return 'bg-slate-100 ';
  switch (item.isValidRule) {
    case 'red':
      return 'bg-slate-100 ';
    case 'green':
    case 'yellow':
      return ' bg-[#dff2bf] ';
    default:
      return 'bg-slate-100 ';
  }
};

export const getFeedbackStyleRewriteRuleDividerDefault: GetFeedbackStyle = (
  showFeedback,
  item
) => {
  if (!showFeedback) return '#d3d3d3';
  switch (item.isValidRule) {
    case 'red':
      return '#ff0000';
    case 'green':
    case 'yellow':
      return '#008000';
    default:
      return '#d3d3d3';
  }
};

export const getFeedbackStyleRewriteRuleDividerOnlyInvalidItems: GetFeedbackStyle =
  (showFeedback, item) => {
    if (!showFeedback) return '#d3d3d3';
    switch (item.isValidRule) {
      case 'red':
        return '#d3d3d3';
      case 'green':
      case 'yellow':
        return '#008000';
      default:
        return '#d3d3d3';
    }
  };
