// The player on the TV. The cursor leaves together with the controls instead of waiting for the system's
// own timeout, the arrow keys only seek and change the volume (they no longer also move the focus), and
// OK pressed after them (the remote is then in 5-way mode and sends Enter) plays or pauses.
const React = require('react');
const { setCursorHidden } = require('./cursor');

const isTyping = (element) => element instanceof HTMLElement && (element.matches('input, textarea, select') || element.isContentEditable);

const usePlayerRemote = ({ overlayHidden, onPlayPause }) => {
    React.useEffect(() => {
        setCursorHidden(overlayHidden);
    }, [overlayHidden]);

    React.useEffect(() => () => setCursorHidden(false), []);

    React.useEffect(() => {
        const spatialNavigation = window.__spatialNavigation__;
        if (!spatialNavigation) return;

        const keyMode = spatialNavigation.keyMode;
        spatialNavigation.keyMode = 'NONE';
        return () => {
            spatialNavigation.keyMode = keyMode;
        };
    }, []);

    React.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== 'Enter' || event.repeat) return;
            const focused = document.activeElement;
            // A focused control takes OK as a click.
            if (isTyping(focused) || (focused !== document.body && focused?.matches('[tabindex]'))) return;

            event.preventDefault();
            onPlayPause();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onPlayPause]);
};

module.exports = usePlayerRemote;
