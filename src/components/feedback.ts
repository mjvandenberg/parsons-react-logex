import { GetFeedbackStyle } from '../types';

const redStyle = 'border-[#ff0000] bg-[#ffbaba] ';
const greenStyle = 'border-[#008200] bg-[#dff2bf] ';
const yellowStyle = greenStyle;

export const getFeedbackStyleBlockDefault: GetFeedbackStyle = (item) => {
  switch (item.isValid) {
    case 'red':
      return redStyle;
    case 'green':
    case 'yellow':
      return greenStyle;
    default:
      return '';
  }
};

export const getFeedbackStyleBlockOnlyInvalidItems: GetFeedbackStyle = (
  item
) => {
  switch (item.isValid) {
    case 'red':
      return '';
    case 'green':
    case 'yellow':
      return greenStyle;
    default:
      return '';
  }
};

export const getFeedbackStyleRewriteRuleDefault: GetFeedbackStyle = (item) => {
  switch (item.isValid) {
    case 'red':
      return 'bg-[#ffbaba]';
    case 'green':
    case 'yellow':
      return 'bg-[#dff2bf]';
    default:
      return 'bg-slate-100';
  }
};

export const getFeedbackStyleRewriteRuleOnlyInvalidItems: GetFeedbackStyle = (
  item
) => {
  switch (item.isValid) {
    case 'red':
      return 'bg-slate-100';
    case 'green':
    case 'yellow':
      return ' bg-[#dff2bf]';
    default:
      return 'bg-slate-100';
  }
};
