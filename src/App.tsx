import './App.css';

import logExResponse from './logEx/data/equivalence/oneFinal1';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';
import { Dropdown } from 'flowbite-react';

function App() {
  const properties = OneFinalToParsonsProblemProperties(
    logExResponse,
    'equivalence'
  );

  const handleExerciseChange: FormEventHandler<HTMLButton> = () => {};

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
            <Dropdown
              color="gray"
              label="Select exercise"
              className="bg-red-800 float-right"
              onChange={handleExerciseChange}
            >
              <Dropdown.Item>Exercise 1</Dropdown.Item>
              <Dropdown.Item>Exercise 2</Dropdown.Item>
              <Dropdown.Item>Exercise 3</Dropdown.Item>
              <Dropdown.Item>Exercise 4</Dropdown.Item>
              <Dropdown.Item>Exercise 5</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>

      <hr />
      <Parsons {...properties} />
    </div>
  );
}

export default App;
