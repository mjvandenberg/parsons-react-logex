import { FC } from 'react';
import { ParsonsSettings } from '../types';

interface Props {
  settings: ParsonsSettings;
}

const SettingsModal: FC<Props> = ({ settings }) => {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Settings</h3>
          <p className="py-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Remember me</span>
                <input
                  type="checkbox"
                  checked={settings.instantFeedback}
                  className="checkbox"
                />
              </label>
            </div>
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
