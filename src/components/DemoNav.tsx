import { Link, useLocation } from 'react-router-dom'
import { c } from '../theme'

const targets: [string, string][] = [
  ['/', 'Forside'],
  ['/sak', 'Saksflyt'],
  ['/mine-saker', 'Mine saker'],
  ['/admin', 'Admin'],
]

/**
 * Floating quick-nav shown only in the single-file demo build (VITE_DEMO=1),
 * so testers can reach every surface — including the admin console, which
 * deliberately has no inbound link in the product design.
 */
export function DemoNav() {
  const { pathname } = useLocation()
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 14,
        right: 14,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: c.greenDeep,
        borderRadius: 99,
        padding: '5px 6px 5px 12px',
        boxShadow: '0 10px 30px -10px rgba(18,56,43,.55)',
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', color: c.sage, marginRight: 4 }}>
        DEMO
      </span>
      {targets.map(([to, label]) => {
        const active = pathname === to
        return (
          <Link
            key={to}
            to={to}
            style={{
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              color: active ? c.greenDeep : c.cream,
              background: active ? c.mint : 'transparent',
              borderRadius: 99,
              padding: '5px 10px',
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
