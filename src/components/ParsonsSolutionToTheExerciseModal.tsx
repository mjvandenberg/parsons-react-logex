import { FC } from 'react';
import { ruleTranslations } from '../logEx/rules';
import { ParsonsProblemProperties } from '../types';
import { neutralStyle } from './feedback';

const ParsonsSolutionToTheExerciseModal: FC<ParsonsProblemProperties> = ({
  exerciseSolution,
  exerciseName,
}) => {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <label htmlFor="my-modal-5" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <>
            <label
              htmlFor="my-modal-5"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="text-lg font-bold">{exerciseName} solution:</h3>
            <p>
              {exerciseSolution.map((i, x) =>
                i.type === 'block' ? (
                  <div
                    className={
                      'parsons-block katex relative text-left pl-2 leading-9 rounded-lg border select-none static text-center ' +
                      neutralStyle
                    }
                  >
                    {i.text}
                  </div>
                ) : (
                  <div
                    className={
                      'parsons-block relative text-left pl-2 leading-9 border select-none static text-center bg-slate-100 w-[calc(100%-20px)] m-auto normal-case'
                    }
                  >
                    {(ruleTranslations['en'] as any)[i.text]}
                  </div>
                )
              )}
            </p>
          </>
        </label>
      </label>
    </>
  );
};

export default ParsonsSolutionToTheExerciseModal;
