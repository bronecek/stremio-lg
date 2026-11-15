// The remote's Back key. appinfo.json sets disableBackHistoryAPI, so the system leaves Back to the app:
// an open popup or menu closes (as on Escape), the player closes its menu or leaves, any other screen
// goes back, and the Board leaves the app.
const React = require('react');
const { matchPath, useLocation } = require('react-router');
const { useGoBack } = require('stremio-router');
const { PLAYER_PATH } = require('stremio-router/getBackFallback');
const { isOverlayOpen } = require('./overlays');
const { exitApp } = require('./platform');

const BACK_KEY_CODE = 461;
const MAIN_PATHS = ['/', '/intro'];

const pressEscape = () => {
    const target = document.activeElement instanceof HTMLElement ? document.activeElement : document.body;
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
};

const useBackKey = () => {
    const location = useLocation();
    const goBack = useGoBack();

    React.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.keyCode !== BACK_KEY_CODE) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            // A held Back repeats; only the press counts, or one hold would leave several screens.
            if (event.repeat) return;
            if (isOverlayOpen() || matchPath(PLAYER_PATH, location.pathname) !== null) {
                pressEscape();
            } else if (MAIN_PATHS.includes(location.pathname)) {
                exitApp();
            } else {
                goBack();
            }
        };

        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [location.pathname, goBack]);
};

module.exports = useBackKey;
