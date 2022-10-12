import './App.css';

import logExOneFinalResponse from './logEx/data/logExOneFinalResponse1';
import Parsons from './components/Parsons';
import {
  OneFinaleResponseToParsonsListLeft,
  OneFinaleResponseToParsonsListRight,
  solutionResponseToParsonsListLeft,
  solutionResponseToParsonsListRight,
} from './logEx/logExHelpers';
import { OneFinalResponse } from './logEx/typesOneFinal';
import { ItemType } from './types';

function App() {
  const exerciseName = 'Exercise 5';
  const exerciseDescription = (
    <>
      Convert{' '}
      <span className="katex">
        {logExOneFinalResponse.onefinal.context.term[0].toString()}
      </span>{' '}
      to conjunctive normal form
    </>
  );
  const listLeft: ItemType[] = OneFinaleResponseToParsonsListLeft(
    logExOneFinalResponse
  );
  const listRight: ItemType[] = OneFinaleResponseToParsonsListRight(
    logExOneFinalResponse
  );

  return (
    <div className="">
      <Parsons
        exerciseName={exerciseName}
        exerciseDescription={exerciseDescription}
        listLeft={listLeft}
        listRight={listRight}
      />
    </div>
  );
}

export default App;
