// Pointer and arrow keys take turns on the TV. While the system hides the Magic Remote cursor
// (cursorStateChange, or the key codes webOS still sends next to it), <html> carries
// `webos-cursor-hidden`: the hover under the hidden cursor is cleared, so only the arrow-key focus shows,
// and it comes back where the cursor reappears.
const CURSOR_SHOWN_KEY_CODE = 1536;
const CURSOR_HIDDEN_KEY_CODE = 1537;
const HIDDEN_CLASS = 'webos-cursor-hidden';

const installCursorMode = () => {
    const root = document.documentElement;
    let target = null;
    let point = null;

    document.addEventListener('pointerover', (event) => {
        if (event.isTrusted) {
            target = event.target;
            point = [event.clientX, event.clientY];
        }
    }, true);

    // React derives pointerleave/pointerenter (react-aria's hover) from pointerout/pointerover.
    const hide = () => {
        if (root.classList.contains(HIDDEN_CLASS)) return;
        root.classList.add(HIDDEN_CLASS);
        if (target?.isConnected) {
            target.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget: null }));
        }
    };
    const show = () => {
        if (!root.classList.contains(HIDDEN_CLASS)) return;
        root.classList.remove(HIDDEN_CLASS);
        const element = point && document.elementFromPoint(point[0], point[1]);
        if (element) {
            element.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse', clientX: point[0], clientY: point[1] }));
        }
    };

    // The app often starts with the cursor already hidden, and no event says so.
    if (window.PalmSystem?.cursor?.visibility === false) {
        root.classList.add(HIDDEN_CLASS);
    }

    document.addEventListener('cursorStateChange', (event) => {
        event.detail?.visibility === false ? hide() : show();
    });
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === CURSOR_HIDDEN_KEY_CODE) hide();
        if (event.keyCode === CURSOR_SHOWN_KEY_CODE) show();
    }, true);
};

module.exports = {
    installCursorMode,
};
