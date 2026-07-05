import { Link } from 'react-router-dom'
import { c, font } from '../theme'

type Props = {
  /** side length of the square mark in px */
  mark?: number
  /** wordmark font size in px */
  word?: number
  /** true → cream mark on dark surface (M is deep-green on cream) */
  inverted?: boolean
  /** wrap in a Link back to home */
  link?: boolean
}

/** The Medhold "M" mark + wordmark. */
export function Logo({ mark = 28, word = 19, inverted = false, link = true }: Props) {
  const inner = (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: inverted ? c.cream : c.ink }}>
      <span
        style={{
          width: mark,
          height: mark,
          background: inverted ? c.cream : c.green,
          borderRadius: Math.round(mark / 4),
          display: 'grid',
          placeItems: 'center',
          color: inverted ? c.greenDeep : c.cream,
          fontFamily: font.serif,
          fontWeight: 700,
          fontSize: Math.round(mark * 0.6),
        }}
      >
        M
      </span>
      <span style={{ fontWeight: 800, fontSize: word, letterSpacing: '-0.3px' }}>Medhold</span>
    </span>
  )
  if (!link) return inner
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  )
}
