import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './SignUpPage.css'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (apiError) setApiError('')
  }

  function validate() {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')

    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      )
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully! Please sign in.' },
      })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <h2 className="signup-page__title">Create an account</h2>
      <p className="signup-page__subtitle">Get started with AssetTrack</p>

      {apiError && (
        <div className="signup-page__alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      <form className="signup-page__form" onSubmit={handleSubmit} noValidate>
        <div className="signup-page__row">
          <div className="form-group">
            <label className="form-label" htmlFor="signup-firstName">
              First name
            </label>
            <input
              id="signup-firstName"
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              autoFocus
            />
            {errors.firstName && (
              <span className="form-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-lastName">
              Last name
            </label>
            <input
              id="signup-lastName"
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <span className="form-error">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">
            Email address
          </label>
          <input
            id="signup-email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-confirmPassword">
            Confirm password
          </label>
          <input
            id="signup-confirmPassword"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full signup-page__submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="signup-page__spinner"></span>
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="signup-page__footer">
        Already have an account?{' '}
        <Link to="/login" className="signup-page__link">
          Sign in
        </Link>
      </p>
    </div>
  )
}
