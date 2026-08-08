/**
 * The mark Payload puts in the breadcrumb, at roughly 24px.
 *
 * That slot is far too small for the academy's logo: it carries an arch, three
 * diamonds, a T and a fanned book, none of which survive at that size. Payload
 * already links this to the dashboard, so it is a home button, and a home glyph
 * is what it should look like. The logo lives at the top of the sidebar
 * instead, where it has room to read.
 */
export function Icon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      role="img"
      aria-label="Kreu i panelit"
      style={{ display: 'block' }}
    >
      <path
        d="M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19v-8.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
