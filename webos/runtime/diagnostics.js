// A short in-memory log of what the remote and the system send, read over `ares-inspect` when something
// on the TV behaves oddly: `window.__webosLog` keeps the last 300 entries (time, event, detail).
const LIMIT = 300;

const installDiagnostics = () => {
    const log = [];
    const start = performance.now();
    const add = (event, detail = '') => {
        log.push(`${((performance.now() - start) / 1000).toFixed(2)}s ${event} ${detail}`);
        if (log.length > LIMIT) log.shift();
    };
    const describe = (target) => target instanceof Element ? `${target.tagName.toLowerCase()}.${String(target.className).slice(0, 40)}` : String(target);

    window.__webosLog = log;
    add('start', `${innerWidth}x${innerHeight} ${location.hash}`);
    document.addEventListener('keydown', (event) => add('keydown', `${event.key} ${event.keyCode}${event.repeat ? ' repeat' : ''} on ${describe(event.target)}`), true);
    ['pointerdown', 'pointerup', 'click'].forEach((type) => {
        document.addEventListener(type, (event) => add(type, `${Math.round(event.clientX)},${Math.round(event.clientY)} ${event.pointerType || ''} on ${describe(event.target)}${event.isTrusted ? '' : ' (synthetic)'}`), true);
    });
    document.addEventListener('cursorStateChange', (event) => add('cursorStateChange', String(event.detail?.visibility)));
    document.addEventListener('keyboardStateChange', (event) => add('keyboardStateChange', String(event.detail?.visibility)));
    document.addEventListener('webOSMouse', (event) => add('webOSMouse', JSON.stringify(event.detail)));
    document.addEventListener('focusin', (event) => add('focusin', describe(event.target)), true);
    document.addEventListener('input', (event) => add('input', `${describe(event.target)} "${String(event.target.value ?? '').slice(-20)}"`), true);
    document.addEventListener('focusout', (event) => add('focusout', `${describe(event.target)} -> ${describe(event.relatedTarget)}`), true);
    document.addEventListener('visibilitychange', () => add('visibilitychange', document.visibilityState));
    window.addEventListener('focus', () => add('window focus'));
    window.addEventListener('blur', () => add('window blur'));
    document.addEventListener('webOSRelaunch', () => add('webOSRelaunch'));
    window.addEventListener('hashchange', () => add('hashchange', location.hash.slice(0, 40)));
};

module.exports = {
    installDiagnostics,
};
