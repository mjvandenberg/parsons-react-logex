import './App.css';

import logExResponse from './logEx/data/equivalence/oneFinal1';
import Parsons from './components/Parsons';
import { OneFinalToParsonsProblemProperties } from './logEx/logExHelpers';

function App() {
  var properties = OneFinalToParsonsProblemProperties(
    logExResponse,
    'equivalence'
  );

  return (
    <div className="">
      <Parsons {...properties} />
    </div>
  );
}

export default App;
