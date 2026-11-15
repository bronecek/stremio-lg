// The arrow keys on the TV move the focus to the nearest control in their direction, also one off screen
// (the next row of the Board), and bring it into view at once. The spatial-navigation polyfill the web app
// ships only considers what is on screen and scrolls step by step before it moves the focus.
// Inside an open popup or dialog the arrows stay in it; in the player they belong to seeking, and its
// settings panel navigates itself.
const { findOverlay } = require('./overlays');

const DIRECTIONS = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
};

const FOCUSABLE = [
    '[tabindex]:not([tabindex="-1"])',
    'a[href]',
    'button:not([disabled])',
    'input:not([type="hidden"]):not([type="file"]):not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
].join(', ');

const isTyping = (element) => element instanceof HTMLElement && (element.matches('input, textarea, select') || element.isContentEditable);

const usable = (element) => {
    if (!element.checkVisibility({ visibilityProperty: true }) || element.closest('.disabled, [aria-disabled="true"]')) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
};

const center = (element) => {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
};

// The nearest candidate in the arrow's direction, the sideways offset counting twice.
const nearest = (candidates, from, [dx, dy]) => {
    const [fx, fy] = center(from);
    let best = null;
    let bestScore = Infinity;
    candidates.forEach((element) => {
        if (element === from || from.contains(element) || element.contains(from)) return;
        const [ex, ey] = center(element);
        const along = (ex - fx) * dx + (ey - fy) * dy;
        if (along <= 1) return;
        const score = along + 2 * Math.abs((ex - fx) * dy + (ey - fy) * dx);
        if (score < bestScore) {
            best = element;
            bestScore = score;
        }
    });
    return best;
};

const inPlayer = () => document.querySelector('[class*="player-container"]')?.checkVisibility() === true;

const installArrowNavigation = () => {
    if (window.__spatialNavigation__) {
        window.__spatialNavigation__.keyMode = 'NONE';
    }

    // On window, after the app's own handlers: a key one of them took is not ours.
    window.addEventListener('keydown', (event) => {
        const direction = DIRECTIONS[event.key];
        if (!direction || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const active = document.activeElement;
        if (isTyping(active) && direction[0] !== 0) return;

        const overlay = findOverlay();
        if (overlay === null && inPlayer()) return;

        const scope = overlay ?? document.getElementById('app');
        const candidates = Array.from(scope.querySelectorAll(FOCUSABLE)).filter(usable);
        if (candidates.length === 0) return;

        const from = active instanceof HTMLElement && active !== document.body && scope.contains(active) ? active : null;
        const next = from !== null ? nearest(candidates, from, direction) : candidates[0];
        if (next === null) return;

        event.preventDefault();
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
};

module.exports = {
    installArrowNavigation,
};
