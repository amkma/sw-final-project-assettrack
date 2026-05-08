import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        {/* Animated 404 illustration */}
        <div className="not-found-page__illustration">
          <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
            {/* "4" left */}
            <text x="10" y="100" className="not-found-page__digit">4</text>
            {/* "0" center — as a circle */}
            <circle cx="100" cy="72" r="38" stroke="var(--primary-500)" strokeWidth="8" fill="none" className="not-found-page__zero" />
            <circle cx="90" cy="62" r="5" fill="var(--primary-400)" className="not-found-page__eye" />
            <circle cx="110" cy="62" r="5" fill="var(--primary-400)" className="not-found-page__eye" />
            <path d="M88 82 Q100 92 112 82" stroke="var(--primary-400)" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* "4" right */}
            <text x="142" y="100" className="not-found-page__digit">4</text>
          </svg>
        </div>

        <h1 className="not-found-page__title">Page Not Found</h1>
        <p className="not-found-page__message">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="not-found-page__actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1l-7 7h4v6h6V8h4L8 1z" />
            </svg>
            Go Home
          </Link>
          <Link to="/assets" className="btn btn-secondary btn-lg">
            Browse Assets
          </Link>
        </div>
      </div>
    </div>
  )
}
