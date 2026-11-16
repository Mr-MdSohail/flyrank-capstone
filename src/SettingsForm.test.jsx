import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  beforeEach(() => { localStorage.clear() })

  it('loads saved settings from localStorage on mount', () => {
    localStorage.setItem('user_settings', JSON.stringify({ username: 'sohail_dev', email: 'sohail@example.com', theme: 'dark', notifications: false }))
    render(<SettingsForm />)
    expect(screen.getByLabelText(/username/i)).toHaveValue('sohail_dev')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('sohail@example.com')
    expect(screen.getByLabelText(/theme/i)).toHaveValue('dark')
    expect(screen.getByLabelText(/email notifications/i)).not.toBeChecked()
  })

  it('shows accessible inline errors and blocks submission', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    await user.type(usernameInput, 'ab')
    await user.tab()
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true')
    expect(usernameInput).toHaveAttribute('aria-describedby', 'username-error')
    expect(screen.getByText(/3-20 alphanumeric/i)).toBeInTheDocument()
    await user.type(emailInput, 'not-an-email')
    await user.tab()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled()
    expect(localStorage.getItem('user_settings')).toBeNull()
  })

  it('trims whitespace, saves to localStorage, and shows status banner', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)
    await user.type(screen.getByLabelText(/username/i), '  sohail_99  ')
    await user.type(screen.getByLabelText(/^email$/i), '  sohail@test.com  ')
    await user.selectOptions(screen.getByLabelText(/theme/i), 'light')
    await user.click(screen.getByRole('button', { name: /save settings/i }))
    await waitFor(() => { expect(screen.getByRole('status')).toHaveTextContent(/settings saved successfully/i) })
    expect(JSON.parse(localStorage.getItem('user_settings'))).toEqual({ username: 'sohail_99', email: 'sohail@test.com', theme: 'light', notifications: true })
  })

  it('resets form values and clears localStorage on reset', async () => {
    const user = userEvent.setup()
    localStorage.setItem('user_settings', JSON.stringify({ username: 'sohail_dev', email: 'sohail@example.com', theme: 'dark', notifications: false }))
    render(<SettingsForm />)
    await user.click(screen.getByRole('button', { name: /reset to defaults/i }))
    expect(screen.getByLabelText(/username/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/theme/i)).toHaveValue('system')
    expect(screen.getByLabelText(/email notifications/i)).toBeChecked()
    expect(localStorage.getItem('user_settings')).toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent(/reset to defaults/i)
  })
})
