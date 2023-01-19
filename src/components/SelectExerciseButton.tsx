import { FC } from 'react';
import { exerciseNames } from '../logEx/data/equivalence/all';
import CaretDownIcon from './CaretDownIcon';

type Props = {
  exercises: any;
  onExerciseChange: (name: exerciseNames) => void;
};

const SelectExerciseButton: FC<Props> = ({ exercises, onExerciseChange }) => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-primary normal-case">
        Select exercise &nbsp;&nbsp;&nbsp;
        <CaretDownIcon />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {Object.keys(exercises).map((i, x) => (
          <li key={`${x}`}>
            <a onClick={() => onExerciseChange(i as exerciseNames)}>{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectExerciseButton;
