import './App.css';

import allExercises, { exerciseNames } from './logEx/data/equivalence/all';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';
import { useState } from 'react';

const defaultExercise = 'Exercise 1';

const App = () => {
  const [parsonsProps, setParsonsProps] = useState(
    OneFinalToParsonsProblemProperties(
      allExercises[defaultExercise],
      'equivalence'
    )
  );

  const handleExerciseChange: (exerciseName: exerciseNames) => void = (
    exerciseName
  ) => {
    // ts-ignore
    document?.activeElement?.blur();

    const newParsonsProps = OneFinalToParsonsProblemProperties(
      allExercises[exerciseName],
      'equivalence'
    );
    setParsonsProps(newParsonsProps);
  };

  return (
    <div className="text-left">
      <div className="flex flex-row">
        <div className="basis-1/2 text-left">
          <h1 className="m-3 text-lg font-semibold">
            Prove Logical Equivalence
          </h1>
        </div>
        <div className="basis-1/2">
          <div className="float-right">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-primary normal-case mx-1">
                Select exercise
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {Object.keys(allExercises).map((i, x) => (
                  <li key={`${x}`}>
                    <a onClick={() => handleExerciseChange(i as exerciseNames)}>
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <Parsons {...parsonsProps} />
    </div>
  );
};

export default App;
