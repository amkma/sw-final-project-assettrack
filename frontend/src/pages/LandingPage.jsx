import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import TextType from '../components/common/TextType'
import DotGrid from '../components/common/DotGrid'
import './LandingPage.css'

export default function LandingPage() {
  const heroRef = useRef(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const sloganRef = useRef(null)
  const buttonsRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(logoRef.current, {
        y: -40,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
      })
        .from(titleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.7,
        }, '-=0.3')
        .from(sloganRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
        }, '-=0.3')
        .from(buttonsRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
        }, '-=0.2')

      // Particles replaced by DotGrid
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="landing-page" ref={heroRef}>
      {/* Animated Background Grid */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <DotGrid
          dotSize={2}
          gap={16}
          baseColor="#1a1d3a"
          activeColor="#748ffc"
          proximity={140}
          shockRadius={200}
          shockStrength={3}
          resistance={800}
          returnDuration={1.5}
        />
      </div>

      {/* Top Navigation Bar */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-brand">
          <div className="landing-page__nav-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span>AssetTrack</span>
        </div>
        <div className="landing-page__nav-links">
          <Link to="/login" className="btn btn-ghost landing-page__nav-btn">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary landing-page__nav-btn">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="landing-page__hero">
        {/* Logo */}
        <div className="landing-page__logo" ref={logoRef}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="18" fill="url(#logo-grad)" />
            <path
              d="M36 16l-14 14h8v14h12V30h8L36 16z"
              fill="rgba(255,255,255,0.95)"
            />
            <path
              d="M22 50h28v4H22z"
              fill="rgba(255,255,255,0.6)"
              rx="2"
            />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="72" y2="72">
                <stop stopColor="#4c6ef5" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <h1 className="landing-page__title" ref={titleRef}>
          AssetTrack
        </h1>

        {/* Animated Slogan */}
        <div className="landing-page__slogan" ref={sloganRef}>
          <TextType
            texts={[
              'Track every asset. Empower every team.',
              'Hardware management, simplified.',
              'From procurement to retirement — all in one place.',
              'Know what you own. Know where it is.',
            ]}
            typingSpeed={65}
            deletingSpeed={35}
            pauseDuration={2000}
            showCursor
            cursorCharacter="|"
            cursorBlinkDuration={0.5}
          />
        </div>


        {/* CTA Buttons */}
        <div className="landing-page__buttons" ref={buttonsRef}>
          <Link to="/signup" className="btn landing-page__btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M9 1a8 8 0 100 16A8 8 0 009 1zm1 11H8V8h2v4zm0-6H8V4h2v2z" />
            </svg>
            Create Account
          </Link>
          <Link to="/login" className="btn landing-page__btn-secondary">
            Sign In
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Subtle tagline */}
        <p className="landing-page__tagline">
          Trusted hardware asset management for modern teams
        </p>
      </div>
    </div>
  )
}
