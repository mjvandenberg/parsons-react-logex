import './App.css';

import allExercises, { exerciseNames } from './logEx/data/equivalence/all';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';
import { useEffect, useState } from 'react';
import SelectExerciseButton from './components/SelectExerciseButton';
import { ParsonsProblemProperties, Settings } from './types';
import SettingsModal from './components/SettingsModal';
import { useStatePersist } from 'use-state-persist';

const defaultExercise = 'Exercise 1';
const exerciseType = 'equivalence';
const includeDistractors = true;

const App = () => {
  const [parsonsProps, setParsonsProps] = useState<ParsonsProblemProperties>();
  const [showFeedback, _setShowFeedback] = useState(false);
  const [settings, setSettings] = useStatePersist<Settings>(
    '@parsons-settings',
    {
      instantFeedback: false,
      markInvalidItems: true,
    }
  );

  const setShowFeedback = (value: boolean) => {
    if (value === false && settings.instantFeedback === false) {
      _setShowFeedback(value);
    } else if (value === true) {
      _setShowFeedback(value);
    }
  };

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

  useEffect(() => {
    setShowFeedback(settings.instantFeedback);
  }, []);

  const handleUpdateSettings
  : (settings: Settings) => void 
  = (settings) => {
    setSettings(settings);
    if (settings.instantFeedback === true) {
      setShowFeedback(true);
    }
  };

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
                htmlFor="my-modal-4"
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
        {parsonsProps && (
          <Parsons
            {...parsonsProps}
            onReset={handleReset}
            showFeedback={showFeedback}
            setShowFeedback={setShowFeedback}
            settings={settings}
          />
        )}
      </div>
      {parsonsProps && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </>
  );
};

export default App;
