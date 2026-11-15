// On a webOS TV 26 set a press on the on-screen keyboard also reaches the page underneath it: the search
// field lost the focus and the keyboard closed under the pointer. While the keyboard is up, presses in
// its part of the screen (the lower part) are kept from the page; a press above it still leaves the field.
const KEYBOARD_TOP = 0.55;
const PRESSES = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];

const installKeyboardGuard = () => {
    let visible = false;
    document.addEventListener('keyboardStateChange', (event) => {
        visible = event.detail?.visibility === true;
    });

    const guard = (event) => {
        if (!(visible || window.PalmSystem?.isKeyboardVisible === true)) return;
        if (event.clientY < innerHeight * KEYBOARD_TOP) return;

        event.preventDefault();
        event.stopImmediatePropagation();
    };
    PRESSES.forEach((type) => window.addEventListener(type, guard, { capture: true, passive: false }));
};

module.exports = {
    installKeyboardGuard,
};
