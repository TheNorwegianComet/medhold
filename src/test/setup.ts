import '@testing-library/jest-dom/vitest'

// jsdom does not implement scrolling — the app's ScrollManager and hash
// navigation call these on every route change.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
