import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    feedback: '',
  });

  // Update theme
  const handleThemeChange = () => {
    setUserSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  // Update feedback text
  const handleFeedbackChange = (event) => {
    setUserSettings((prev) => ({
      ...prev,
      feedback: event.target.value,
    }));
  };

  // Placeholder function to save settings
  const handleSaveFeedback = () => {
    alert('Thank you for your feedback!');
    setUserSettings((prev) => ({ ...prev, feedback: '' }));
  };

  return (
    <div className={`settings-container ${userSettings.theme}`}>
      <h2>Settings</h2>

      {/* Themes Section */}
      <section className="settings-section">
        <h3>Themes</h3>
        <div className="settings-option">
          <label>Dark Mode:</label>
          <input
            type="checkbox"
            checked={userSettings.theme === 'dark'}
            onChange={handleThemeChange}
          />
        </div>
      </section>

      {/* About Section */}
      <section className="settings-section">
        <h3>About</h3>
        <p>App Version: 1.0.0</p>
        <p>This app is designed to manage your products and settings efficiently.</p>
      </section>

      {/* Help and Support Section */}
      <section className="settings-section">
        <h3>Help and Support</h3>
        <p>If you need assistance, please refer to our <a href="https://support.example.com">Support Center</a>.</p>
        <p>Contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
      </section>

      {/* Feedback Form */}
      <section className="settings-section">
        <h3>Feedback</h3>
        <textarea
          value={userSettings.feedback}
          onChange={handleFeedbackChange}
          placeholder="Leave your feedback here..."
        />
        <button onClick={handleSaveFeedback}>Submit Feedback</button>
      </section>
    </div>
  );
};

export default Settings;
