import { useState } from 'react';

function SettingsForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    theme: 'system',
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <section id="settings">
      <div className="settings-container">
        <h2>Account Settings</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme Preference</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
            />
            <label htmlFor="notifications">Enable Email Notifications</label>
          </div>

          <button type="submit" className="save-button">
            Save Settings
          </button>
        </form>
      </div>
    </section>
  );
}

export default SettingsForm;
