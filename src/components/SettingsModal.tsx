import { FC } from 'react';
import { Settings } from '../types';

interface Props {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

const SettingsModal: FC<Props> = ({ settings, onUpdateSettings }) => {
  return (
    <>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Change settings</h3>
          <p className="py-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Instant feedback!</span>
                <input
                  type="checkbox"
                  checked={settings.instantFeedback}
                  className="toggle"
                  onChange={() =>
                    onUpdateSettings({
                      ...settings,
                      instantFeedback: !settings.instantFeedback,
                    })
                  }
                />
              </label>
            </div>
          </p>
          <p className="py-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Mark invalid items</span>
                <input
                  type="checkbox"
                  checked={settings.markInvalidItems}
                  className="toggle"
                  onChange={() =>
                    onUpdateSettings({
                      ...settings,
                      markInvalidItems: !settings.markInvalidItems,
                    })
                  }
                />
              </label>
            </div>
          </p>
        </label>
      </label>
    </>
  );
};

export default SettingsModal;
