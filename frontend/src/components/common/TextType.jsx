import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import './TextType.css'

/**
 * TextType — animated typing effect using GSAP.
 *
 * @param {string[]} texts             — array of strings to cycle through
 * @param {number}   typingSpeed       — ms per character typed
 * @param {number}   deletingSpeed     — ms per character deleted
 * @param {number}   pauseDuration     — ms to pause after typing a line
 * @param {boolean}  showCursor        — show blinking cursor
 * @param {string}   cursorCharacter   — cursor character
 * @param {number}   cursorBlinkDuration — blink speed in seconds
 */
export default function TextType({
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
}) {
  const [displayText, setDisplayText] = useState('')
  const indexRef = useRef(0)
  const charRef = useRef(0)
  const deletingRef = useRef(false)
  const cursorRef = useRef(null)

  // Blink the cursor with GSAP
  useEffect(() => {
    if (!showCursor || !cursorRef.current) return
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
    return () => tween.kill()
  }, [showCursor, cursorBlinkDuration])

  const tick = useCallback(() => {
    const currentText = texts[indexRef.current] || ''

    if (!deletingRef.current) {
      // Typing forward
      charRef.current++
      setDisplayText(currentText.slice(0, charRef.current))

      if (charRef.current >= currentText.length) {
        deletingRef.current = true
        return pauseDuration // pause before deleting
      }
      return typingSpeed
    } else {
      // Deleting
      charRef.current--
      setDisplayText(currentText.slice(0, charRef.current))

      if (charRef.current <= 0) {
        deletingRef.current = false
        indexRef.current = (indexRef.current + 1) % texts.length
        return typingSpeed
      }
      return deletingSpeed
    }
  }, [texts, typingSpeed, deletingSpeed, pauseDuration])

  useEffect(() => {
    if (!texts.length) return

    let timeoutId

    function loop() {
      const delay = tick()
      timeoutId = setTimeout(loop, delay)
    }

    timeoutId = setTimeout(loop, typingSpeed)
    return () => clearTimeout(timeoutId)
  }, [tick, typingSpeed, texts])

  return (
    <span className="text-type">
      <span className="text-type__text">{displayText}</span>
      {showCursor && (
        <span className="text-type__cursor" ref={cursorRef}>
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
