import React from 'react';
import Switch from '../FormControls/Switch';
import Select from '../FormControls/Select';

const SettingsForm = ({ settings, onChange, onSave, status }) => {
  const handleChange = (name, value) => {
    onChange({ ...settings, [name]: value });
  };

  return (
    <div className='options-container'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Extension Settings</h1>
        <p className='text-gray-600 mt-2'>
          Customize your extension preferences
        </p>
      </div>

      <div className='setting-group'>
        <h2 className='text-lg font-bold mb-4 text-gray-700'>
          General Settings
        </h2>

        <div className='setting-item'>
          <label htmlFor='enableNotifications' className='setting-label'>
            Enable Notifications
          </label>
          <Switch
            id='enableNotifications'
            checked={settings.enableNotifications}
            onChange={(checked) => handleChange('enableNotifications', checked)}
          />
        </div>

        <div className='setting-item'>
          <label htmlFor='theme' className='setting-label'>
            Theme
          </label>
          <Select
            id='theme'
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System Default' }
            ]}
          />
        </div>

        <div className='setting-item'>
          <label htmlFor='refreshInterval' className='setting-label'>
            Refresh Interval (seconds)
          </label>
          <input
            type='number'
            id='refreshInterval'
            value={settings.refreshInterval}
            onChange={(e) =>
              handleChange('refreshInterval', parseInt(e.target.value) || 30)
            }
            min='5'
            max='3600'
            className='w-20 p-2 border border-gray-300 rounded text-right'
          />
        </div>
      </div>

      {status && <div className='status-message'>{status}</div>}

      <div className='flex justify-center'>
        <button onClick={onSave} className='save-button'>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;
