import { Waveform } from 'ldrs/react'
import 'ldrs/react/Waveform.css'
import './LoadingSpinner.css'

/**
 * LoadingSpinner — reusable animated loading indicator.
 *
 * @param {string} size    — "sm" | "md" | "lg"
 * @param {string} message — optional text below spinner
 * @param {boolean} inline — if true, renders just the spinner without wrapper
 */
export default function LoadingSpinner({ size = 'md', message, inline = false }) {
  // Map size prop to specific sizes for Waveform, default md is 35
  const waveformSize = size === 'sm' ? "20" : size === 'lg' ? "45" : "35";

  if (inline) {
    return (
      <Waveform
        size={waveformSize}
        stroke="3.5"
        speed="1"
        color="currentColor"
      />
    )
  }

  return (
    <div className="loading-spinner">
      <Waveform
        size={waveformSize}
        stroke="3.5"
        speed="1"
        color="black" 
      />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  )
}
