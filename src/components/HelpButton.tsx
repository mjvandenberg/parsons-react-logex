import { FC } from 'react';
import CaretDownIcon from './CaretDownIcon';

type Props = {
  onClickHint: () => void;
  onClickShowStep: () => void;
  onClickShowDerivation: () => void;
  onClickCompleteDerivation: () => void;
  className?: string;
};

const HelpButton: FC<Props> = ({
  onClickHint,
  onClickShowStep,
  onClickShowDerivation,
  onClickCompleteDerivation,
  className,
}) => {
  return (
    <div className={'dropdown ' + className}>
      <label
        tabIndex={0}
        className="btn btn-primary normal-case mx-1  min-w-[130px]"
      >
        Help
        <CaretDownIcon />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 min-w-[130px] "
      >
        <li>
          <a onClick={onClickHint}>Hint</a>
        </li>
        <li>
          <a onClick={onClickShowStep}>Complete one step</a>
        </li>
        <li>
          <label htmlFor="my-modal-5" onClick={onClickShowDerivation}>
            Show complete solution
          </label>
        </li>
        <li>
          <a onClick={onClickCompleteDerivation}>Complete my exercise</a>
        </li>
      </ul>
    </div>
  );
};

export default HelpButton;
