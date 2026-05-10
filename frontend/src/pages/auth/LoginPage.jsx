import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const loggedInUser = await login(formData.email, formData.password)
      if (loggedInUser.roleId === 0) {
        navigate('/assets', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h2 className="login-page__title">Welcome back</h2>
      <p className="login-page__subtitle">Sign in to your account</p>

      {apiError && (
        <div className="login-page__alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      <form className="login-page__form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="login-page__password-header">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
          </div>
          <input
            id="login-password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full login-page__submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="login-page__spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="login-page__footer">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="login-page__link">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
