import './App.css';
import { logExSolutionResponse1 as logExSolutionResponse } from './logEx/data/logExSolutionResponse1';
import { SolutionResponse } from './logEx/typesSolution';
import Parsons from './components/Parsons';

function App() {
  const solution: SolutionResponse = logExSolutionResponse;

  return (
    <div className="">
      <Parsons solution={solution} />
    </div>
  );
}

export default App;
