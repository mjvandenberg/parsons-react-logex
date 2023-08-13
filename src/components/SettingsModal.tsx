import { FC } from 'react';
import { Settings } from '../types';
import InfoIcon from './InfoIcon';

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
          <h3 className="text-lg font-bold">Settings</h3>
          <h5 className="text-left text-md font-bold py-2">Feedback</h5>
          <p>
            <label className="label cursor-pointer">
              <span className="label-text">Live feedback <span className='tooltip tooltip-right' data-tip="There will always be feedback about the correctness. It will be updated on every change in the solution panel."><InfoIcon /></span></span>
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
          </p>
          <p>
            <label className="label cursor-pointer">
              <span className="label-text">Only highlight correct items <span className='tooltip' data-tip="Invalid formulas and rewrite rules will not be highlighted. Only the correct ones will be marked green."><InfoIcon /></span></span>
              <input
                type="checkbox"
                checked={!settings.markInvalidItems}
                className="toggle"
                onChange={() =>
                  onUpdateSettings({
                    ...settings,
                    markInvalidItems: !settings.markInvalidItems,
                  })
                }
              />
            </label>
          </p>
          <h5 className="text-left text-md font-bold py-2">Scaffolding</h5>
          <p>
            <label className="label cursor-pointer">
              <span className="label-text">
                Automatically fill in rewrite rules <span className='tooltip' data-tip="The system will manage the selection of rewrite rules. The correct rewrite will be selected, but only if the surrounded formulas are correct."><InfoIcon /></span>
              </span>
              <input
                type="checkbox"
                checked={settings.autoFillRewriteRules}
                className="toggle"
                onChange={() =>
                  onUpdateSettings({
                    ...settings,
                    autoFillRewriteRules: !settings.autoFillRewriteRules,
                  })
                }
              />
            </label>
          </p>
        </label>
      </label>
    </>
  );
};

export default SettingsModal;
