// The open popup, menu, dropdown or dialog, if any: each of them closes on Escape, and the arrow keys
// stay inside it.

// The app-wide modals and the context menus are portaled into <body>, next to #app.
const BODY_OVERLAY_SELECTOR = ':scope > :not(#app):not(script):not(style):not(link)';

// Inside a route: popup menus (focus-locked), inline dropdowns, dialogs, action menus.
const ROUTE_OVERLAY_SELECTOR = [
    '[data-focus-lock-disabled="false"]',
    '[class*="dropdown"][class*="open"]',
    '[role="dialog"]',
    '[role="menu"]',
].join(', ');

const isVisible = (element) => element.checkVisibility?.({ visibilityProperty: true }) ?? true;

const findOverlay = () => {
    const portaled = Array.from(document.body.querySelectorAll(BODY_OVERLAY_SELECTOR)).filter(isVisible).pop();
    if (portaled) return portaled;

    const modals = Array.from(document.querySelectorAll('.modals-container')).find((container) => container.children.length > 0);
    if (modals) return modals;

    return Array.from(document.querySelectorAll(ROUTE_OVERLAY_SELECTOR)).filter(isVisible).pop() ?? null;
};

const isOverlayOpen = () => findOverlay() !== null;

module.exports = {
    findOverlay,
    isOverlayOpen,
};
