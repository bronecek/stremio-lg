// Shows what reaches the app from the remote: keys with their codes, the cursor and keyboard events,
// the pointer type and what the TV answers to the pointer media queries. Back closes it (as any dialog).
const React = require('react');
const { createPortal } = require('react-dom');
const { useTranslation } = require('react-i18next');
const { setCursorHidden } = require('./cursor');

const MEDIA_QUERIES = ['(pointer: fine)', '(pointer: coarse)', '(any-pointer: coarse)', '(hover: hover)', '(hover: none)'];

const STYLES = {
    layer: { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.7)' },
    dialog: { width: '64rem', maxHeight: '90vh', overflow: 'auto', padding: '2rem', borderRadius: '1rem', background: 'var(--modal-background-color, #1b1a2e)', color: '#fff', fontSize: '1.4rem' },
    row: { display: 'flex', gap: '2rem', marginTop: '1rem' },
    column: { flex: 1 },
    log: { fontFamily: 'monospace', whiteSpace: 'pre-wrap', minHeight: '18rem', marginTop: '0.5rem', padding: '1rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.06)' },
    button: { marginTop: '1.5rem', padding: '1rem 2rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.4rem', cursor: 'pointer' },
};

const RemoteTester = ({ onClose }) => {
    const { t } = useTranslation();
    const [keys, setKeys] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [pointer, setPointer] = React.useState('–');
    const [cursorHidden, setHidden] = React.useState(false);

    React.useEffect(() => {
        const push = (setter) => (line) => setter((lines) => [line, ...lines].slice(0, 12));
        const pushKey = push(setKeys);
        const pushEvent = push(setEvents);
        const onKeyDown = (event) => {
            pushKey(`keydown  key=${event.key || '∅'}  code=${event.code || '∅'}  keyCode=${event.keyCode}${event.repeat ? '  (repeat)' : ''}`);
            if (event.key === 'Escape') onClose();
        };
        const onCursor = (event) => pushEvent(`cursorStateChange visibility=${event.detail?.visibility}`);
        const onKeyboard = (event) => pushEvent(`keyboardStateChange visibility=${event.detail?.visibility}`);
        const onWheel = (event) => pushEvent(`wheel deltaY=${Math.round(event.deltaY)}`);
        const onPointer = (event) => setPointer(`${event.type} pointerType=${event.pointerType || '∅'} x=${Math.round(event.clientX)} y=${Math.round(event.clientY)}`);
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('cursorStateChange', onCursor);
        document.addEventListener('keyboardStateChange', onKeyboard);
        document.addEventListener('wheel', onWheel, { passive: true });
        document.addEventListener('pointermove', onPointer, true);
        document.addEventListener('pointerdown', onPointer, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('cursorStateChange', onCursor);
            document.removeEventListener('keyboardStateChange', onKeyboard);
            document.removeEventListener('wheel', onWheel);
            document.removeEventListener('pointermove', onPointer, true);
            document.removeEventListener('pointerdown', onPointer, true);
        };
    }, [onClose]);

    React.useEffect(() => () => setCursorHidden(false), []);

    const toggleCursor = React.useCallback(() => {
        setHidden((hidden) => {
            setCursorHidden(!hidden);
            if (!hidden) setTimeout(() => setHidden(() => { setCursorHidden(false); return false; }), 3000);
            return !hidden;
        });
    }, []);

    return createPortal(
        React.createElement('div', { style: STYLES.layer, onClick: (event) => event.target === event.currentTarget && onClose() },
            React.createElement('div', { style: STYLES.dialog, role: 'dialog' },
                React.createElement('h2', null, t('WEBOS_REMOTE_TESTER')),
                React.createElement('div', null, t('WEBOS_REMOTE_TESTER_HINT')),
                React.createElement('div', { style: STYLES.row },
                    React.createElement('div', { style: STYLES.column }, 'Keys', React.createElement('div', { style: STYLES.log }, keys.join('\n'))),
                    React.createElement('div', { style: STYLES.column }, 'Events', React.createElement('div', { style: STYLES.log }, events.join('\n'))),
                ),
                React.createElement('div', { style: STYLES.log }, [
                    `pointer: ${pointer}`,
                    `cursor asked: ${cursorHidden ? 'blank (3 s)' : 'default'}`,
                    ...MEDIA_QUERIES.map((query) => `${query}: ${window.matchMedia(query).matches}`),
                    `userAgent: ${navigator.userAgent}`,
                ].join('\n')),
                React.createElement('button', { style: STYLES.button, onClick: toggleCursor }, t('WEBOS_REMOTE_TESTER_TOGGLE_CURSOR')),
            ),
        ),
        document.body,
    );
};

module.exports = RemoteTester;
