import { Link } from 'react-router-dom'
import { c } from '../theme'

/** Bottom fine-print row used across the marketing pages. */
export function SiteFooter() {
  return (
    <div
      className="mh-pad mh-stack-sm"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '20px 56px',
        fontSize: 12.5,
        color: c.muted,
        background: c.paper,
      }}
    >
      <span>Medhold © 2026</span>
      <span>
        Vi er ikke et advokatfirma — vi hjelper deg å bruke dine egne vilkår.{' '}
        <Link to="/personvern" style={{ color: c.muted }}>
          Dokumenter slettes etter 30 dager.
        </Link>
      </span>
    </div>
  )
}
