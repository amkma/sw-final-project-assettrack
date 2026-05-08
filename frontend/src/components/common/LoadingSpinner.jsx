import './LoadingSpinner.css'

/**
 * LoadingSpinner — reusable animated loading indicator.
 *
 * @param {string} size    — "sm" | "md" | "lg"
 * @param {string} message — optional text below spinner
 */
export default function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className="loading-spinner">
      <div className={`loading-spinner__circle loading-spinner__circle--${size}`} />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  )
}
