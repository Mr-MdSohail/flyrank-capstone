import { useState, useEffect } from 'react'
import './SettingsForm.css'

const DEFAULT_SETTINGS = {
  username: '',
  email: '',
  theme: 'system',
  notifications: true,
}

export default function SettingsForm() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('user_settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }
  }, [])

  const validate = (name, value) => {
    let error = ''
    if (name === 'username') {
      const trimmed = value.trim()
      if (!trimmed) {
        error = 'Username is required'
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) {
        error = 'Username must be 3-20 alphanumeric characters or underscores'
      }
    } else if (name === 'email') {
      const trimmed = value.trim()
      if (!trimmed) {
        error = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address'
      }
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setSettings((prev) => ({ ...prev, [name]: val }))
    
    if (touched[name]) {
      const error = validate(name, val)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validate(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    const newErrors = {
      username: validate('username', settings.username),
      email: validate('email', settings.email),
    }

    setErrors(newErrors)
    setTouched({ username: true, email: true })

    if (Object.values(newErrors).some((err) => err)) {
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const finalSettings = {
      ...settings,
      username: settings.username.trim(),
      email: settings.email.trim(),
    }

    localStorage.setItem('user_settings', JSON.stringify(finalSettings))
    setSettings(finalSettings)
    setStatus({ type: 'success', message: 'Settings saved successfully!' })
    setIsSubmitting(false)
  }

  const handleReset = () => {
    localStorage.removeItem('user_settings')
    setSettings(DEFAULT_SETTINGS)
    setErrors({})
    setTouched({})
    setStatus({ type: 'success', message: 'Settings reset to defaults.' })
  }

  const hasErrors = Object.values(errors).some((err) => err)

  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      
      {status && (
        <div role="status" className={`status-banner ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={settings.username}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            required
          />
          {errors.username && (
            <span id="username-error" className="error-message">
              {errors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <span id="email-error" className="error-message">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            Email Notifications
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || (Object.keys(touched).length > 0 && hasErrors)}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
          >
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  )
}
