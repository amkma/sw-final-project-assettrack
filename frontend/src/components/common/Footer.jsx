import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">
          © {currentYear} <span className="footer__brand">AssetTrack</span>. All rights reserved.
        </p>
        <p className="footer__text footer__tagline">
          Hardware Asset Management System
        </p>
      </div>
    </footer>
  )
}
