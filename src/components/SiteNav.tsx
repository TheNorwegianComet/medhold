import { Link } from 'react-router-dom'
import { c } from '../theme'
import { Logo } from './Logo'

type NavKey = 'how' | 'cases' | 'price' | null

/**
 * Top navigation used on the marketing pages (landing, eksempelsaker …).
 * `active` underlines the current section. `cta` overrides the button label.
 */
export function SiteNav({ active = null, cta = 'Sjekk oppgjøret gratis' }: { active?: NavKey; cta?: string }) {
  const linkStyle = (key: NavKey) =>
    active === key
      ? { color: c.green, fontWeight: 700, borderBottom: `2px solid ${c.green}`, paddingBottom: 2, textDecoration: 'none' }
      : undefined

  return (
    <div
      className="mh-pad mh-nav"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 56px',
        borderBottom: `1px solid ${c.border}`,
        background: c.paper,
      }}
    >
      <Logo />
      <div
        className="mh-wrap-sm mh-nav-links"
        style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 14.5, fontWeight: 500, color: c.body }}
      >
        <Link className="navlink" to="/#slik-virker-det" style={linkStyle('how')}>
          Slik virker det
        </Link>
        <Link className="navlink" to="/eksempelsaker" style={linkStyle('cases')}>
          Eksempelsaker
        </Link>
        <Link className="navlink" to="/#pris" style={linkStyle('price')}>
          Pris
        </Link>
        <Link
          to="/kom-i-gang"
          className="btn btn-green"
          style={{ padding: '10px 18px', borderRadius: 9, fontSize: 14, boxShadow: 'none' }}
        >
          {cta}
        </Link>
      </div>
    </div>
  )
}
