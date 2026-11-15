// The player on the TV. The controls leave together with the system's cursor, even while it rests on
// them, left and right seek, up and down open the subtitles/audio/speed panel (whose options the arrows
// then move between), and OK
// pressed after them (the remote is then in 5-way mode and sends Enter) plays or pauses. CH ▼ hides the
// controls at once and CH ▲ shows them.
//
// The app does not hide the cursor itself: after PalmSystem.setCursor("blank") a webOS TV 26 set stops
// delivering pointer events, so moving the remote could never bring the cursor back.
const React = require('react');

const CHANNEL_UP_KEY_CODE = 33;
const CHANNEL_DOWN_KEY_CODE = 34;
// webOS still sends these legacy key codes next to cursorStateChange.
const CURSOR_HIDDEN_KEY_CODE = 1537;

const isTyping = (element) => element instanceof HTMLElement && (element.matches('input, textarea, select') || element.isContentEditable);

const usePlayerRemote = ({ menusOpen, onPlayPause, onHideControls, onShowControls, onOpenSettings }) => {
    React.useEffect(() => {
        const onCursorStateChange = (event) => {
            if (event.detail?.visibility === false) {
                onHideControls();
            }
        };
        document.addEventListener('cursorStateChange', onCursorStateChange);
        return () => document.removeEventListener('cursorStateChange', onCursorStateChange);
    }, [onHideControls]);

    React.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.keyCode === CURSOR_HIDDEN_KEY_CODE) {
                onHideControls();
                return;
            }
            if (event.keyCode === CHANNEL_DOWN_KEY_CODE || event.keyCode === CHANNEL_UP_KEY_CODE) {
                event.preventDefault();
                event.keyCode === CHANNEL_DOWN_KEY_CODE ? onHideControls() : onShowControls();
                return;
            }
            // The TV's remote sets the volume, so up and down open subtitles, audio and speed instead.
            if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !menusOpen && !event.defaultPrevented) {
                event.preventDefault();
                onOpenSettings();
                return;
            }
            if (event.key !== 'Enter' || event.repeat) return;
            const focused = document.activeElement;
            // A focused control takes OK as a click.
            if (isTyping(focused) || (focused !== document.body && focused?.matches('[tabindex]'))) return;

            event.preventDefault();
            onPlayPause();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menusOpen, onPlayPause, onHideControls, onShowControls, onOpenSettings]);
};

module.exports = usePlayerRemote;
