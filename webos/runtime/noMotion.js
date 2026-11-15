// The TV app moves nothing on its own: no CSS transitions or animations, no smooth scrolling (from CSS,
// from scrollTo/scrollBy/scrollIntoView options, or the engine's own easing of the remote's wheel), and
// the code that asks for reduced motion (some of it animates from script) is told yes.
// On a TV every animated frame costs, and an eased scroll lags behind the wheel.
const STYLE = `
html.webos *, html.webos *::before, html.webos *::after {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
}`;

const instant = (options) => options !== null && typeof options === 'object' ? { ...options, behavior: 'auto' } : options;

const patchScrolling = (target) => {
    ['scrollTo', 'scrollBy', 'scrollIntoView'].forEach((name) => {
        const original = target[name];
        if (typeof original !== 'function') return;
        target[name] = function (first, ...rest) {
            return original.call(this, instant(first), ...rest);
        };
    });
};

const LINE_HEIGHT = 40;

const REDUCED_MOTION = /prefers-reduced-motion:\s*reduce/;

// The answer never changes, so its listeners have nothing to hear.
const reducedMotion = (media) => ({
    matches: true,
    media,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
});

const patchReducedMotion = () => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => REDUCED_MOTION.test(query) ? reducedMotion(query) : matchMedia(query);
};

const scrollableAncestor = (element, vertical) => {
    for (let node = element; node instanceof Element; node = node.parentElement) {
        const style = getComputedStyle(node);
        const overflow = vertical ? style.overflowY : style.overflowX;
        const room = vertical ? node.scrollHeight - node.clientHeight : node.scrollWidth - node.clientWidth;
        if (room > 1 && /(auto|scroll)/.test(overflow)) return node;
    }
    return null;
};

const installNoMotion = () => {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    patchScrolling(Element.prototype);
    patchScrolling(window);
    patchReducedMotion();

    // Scroll by the wheel's step at once. Handlers that took the wheel themselves (the player's volume,
    // a seek bar) have prevented its default, and those are left alone.
    window.addEventListener('wheel', (event) => {
        if (event.defaultPrevented || event.ctrlKey) return;
        const vertical = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
        const container = scrollableAncestor(event.target, vertical);
        if (container === null) return;

        const delta = (vertical ? event.deltaY : event.deltaX) * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? LINE_HEIGHT : 1);
        event.preventDefault();
        if (vertical) {
            container.scrollTop += delta;
        } else {
            container.scrollLeft += delta;
        }
    }, { passive: false });
};

module.exports = {
    installNoMotion,
};
