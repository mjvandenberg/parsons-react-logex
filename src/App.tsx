import './App.css';

import allExercises, { exerciseNames } from './logEx/data/equivalence/all';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';
import { useEffect, useState } from 'react';
import SelectExerciseButton from './components/SelectExerciseButton';
import { ParsonsProblemProperties } from './types';
import SettingsModal from './components/SettingsModal';

const defaultExercise = 'Exercise 1';
const exerciseType = 'equivalence';
const includeDistractors = true;

const App = () => {
  const [parsonsProps, setParsonsProps] = useState<ParsonsProblemProperties>();

  const selectExercise = (exerciseName: exerciseNames) => {
    const newParsonsProps = OneFinalToParsonsProblemProperties(
      allExercises[exerciseName],
      exerciseType,
      includeDistractors
    );
    setParsonsProps({ ...newParsonsProps, exerciseName });
  };

  const handleExerciseChange: (exerciseName: exerciseNames) => void = (
    exerciseName
  ) => {
    // @ts-ignore
    document?.activeElement?.blur();

    selectExercise(exerciseName);
  };

  const handleReset = () => {
    selectExercise(
      (parsonsProps?.exerciseName || defaultExercise) as exerciseNames
    );
  };

  useEffect(() => {
    selectExercise(defaultExercise);
  }, []);

  return (
    <>
      <div className="text-left">
        <div className="flex flex-row">
          <div className="basis-1/2 text-left">
            <h1 className="m-3 text-lg font-semibold">
              Prove Logical Equivalence
            </h1>
          </div>
          <div className="basis-1/2">
            <div className="float-right pr-1">
              <label
                htmlFor="my-modal-6"
                className="btn btn-primary normal-case mx-1"
              >
                Settings
              </label>
              <SelectExerciseButton
                exercises={allExercises}
                onExerciseChange={handleExerciseChange}
              />
            </div>
          </div>
        </div>

        <hr />
        {parsonsProps && <Parsons {...parsonsProps} onReset={handleReset} />}
      </div>
      <SettingsModal settings={parsonsProps!.settings} />
    </>
  );
};

export default App;
