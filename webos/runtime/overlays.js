// Whether a popup, menu, dropdown or dialog is open: each of them closes on Escape.

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

const isOverlayOpen = () => {
    return Array.from(document.body.querySelectorAll(BODY_OVERLAY_SELECTOR)).some(isVisible)
        || Array.from(document.querySelectorAll('.modals-container')).some((container) => container.children.length > 0)
        || Array.from(document.querySelectorAll(ROUTE_OVERLAY_SELECTOR)).some(isVisible);
};

module.exports = {
    isOverlayOpen,
};
