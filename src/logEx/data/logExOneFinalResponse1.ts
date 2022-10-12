import { OneFinalResponse } from '../typesOneFinal';

export const logExOneFinalResponse1: OneFinalResponse = {
  onefinal: {
    context: {
      term: [
        '~(p /\\ q) || s || ~r',
        {
          type: '=',
          motivation: 'logic.propositional.top-is-or.com',
        },
        '~(p /\\ q) || ~r || s',
        {
          type: '=',
          motivation: '<CLOSE>',
        },
        '~(p /\\ q) || ~r || s',
        {
          type: '=',
          motivation: 'logic.propositional.defimpl',
        },
        '~(p /\\ q) || (r -> s)',
        {
          type: '=',
          motivation: 'logic.propositional.defimpl',
        },
        '(p /\\ q) -> (r -> s)',
      ],
      environment: {
        direction: '0',
        part: '0',
      },
      location: [],
    },
  },
  version: '1.8.1 (27a352d26571dad5913f9786c09ce5cda3021793)',
};

export default logExOneFinalResponse1;
