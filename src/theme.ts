// Design tokens for Medhold — extracted verbatim from the Claude Design
// prototype (project/Medhold.dc.html). The palette is the green/cream
// "original" the user reverted to (no purple / dark blue).

export const c = {
  // surfaces
  canvas: '#EFEBE2', // outer page canvas
  paper: '#FAF6EE', // primary card / page background
  paperAlt: '#F3EDDF', // slightly deeper paper (chips, subtle fills)
  cream: '#F5EFE2', // cream used on dark surfaces
  white: '#fff',

  // greens
  green: '#1E5C43', // primary brand green
  // NOTE: the primary-button hover (#174A36) lives in index.css (.btn-green:hover)
  greenShadow: '#123A2B', // 3D button drop shadow
  greenDeep: '#12382B', // dark green section background
  greenTint: '#E4EFE6', // light green tint (badges, callouts)
  greenTintBorder: '#C2DBC9', // border for green tints
  greenInk: '#2C4A3A', // text on green tint

  // greens on dark surfaces
  sage: '#9DB5A5',
  mint: '#B7E0C4',
  mintBright: '#7FC79A',
  dfGreen: '#DFF0E4',
  paleGreen: '#C9D6CC',
  fadedSand: '#C9BFA6',

  // ink / text
  ink: '#211D15', // near-black body text on paper
  ink2: '#3D3830',
  body: '#544E42', // muted body text
  muted: '#8A8272', // secondary / labels
  muted2: '#6F675A',
  faint: '#B3AA96', // very light labels

  // borders
  border: '#E8E1D2',
  border2: '#DDD5C2',
  borderDash: '#CFC6B2',

  // orange / red (alert, "lavt tilbud", utelatt)
  orange: '#D6491F',
  rust: '#A34418',
  rust2: '#A33415',
  redInk: '#933D15', // text on red tint
  redTint: '#FCEBE3',
  redTintBorder: '#F0CDBC',
  redBar: '#EAD6CC',
  redBarBorder: '#E0BCA9',

  // amber (underpriset)
  amberInk: '#7A5407',
  amberTint: '#F7EDD5',
  amberTintBorder: '#E7D5A8',

  // vipps
  vipps: '#FF5B24',
} as const

export const font = {
  sans: "'Schibsted Grotesk', system-ui, -apple-system, sans-serif",
  serif: "'Source Serif 4', Georgia, serif",
} as const
