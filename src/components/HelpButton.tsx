import CaretDownIcon from './CaretDownIcon';

const HelpButton = () => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-primary normal-case mx-1">
        Help
        <CaretDownIcon />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 min-w-[130px]"
      >
        <li>
          <a>Hint</a>
        </li>
        <li>
          <a>Show step</a>
        </li>
        <li>
          <a>Show complete derivation</a>
        </li>
        <li>
          <a>Complete my derivation</a>
        </li>
      </ul>
    </div>
  );
};

export default HelpButton;
