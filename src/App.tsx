import './App.css';

import allExercises, { exerciseNames } from './logEx/data/equivalence/all';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';
import { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

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
            {/*<Dropdown color="gray" label="Select exercise">
              {Object.keys(allExercises).map((i, x) => (
                <Dropdown.Item
                  key={`${x}`}
                  onClick={() => handleExerciseChange(i as exerciseNames)}
                >
                  {i}
                </Dropdown.Item>
              ))}
              </Dropdown>*/}
            {/*<Dropdown />*/}
          </div>
        </div>
      </div>

      <hr />
      <Parsons {...parsonsProps} />
    </div>
  );
};

export default App;
