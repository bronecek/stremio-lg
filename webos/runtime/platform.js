// webOS system calls. webOSTV.js wraps the same PalmSystem methods; it is not bundled because its
// Apache-2.0 licence does not combine with this GPL-2.0 app.

// Leaves the app the way the system Back does on the first screen: webOS TV 6+ asks whether to exit.
const exitApp = () => {
    if (typeof window.PalmSystem?.platformBack === 'function') {
        window.PalmSystem.platformBack();
    } else {
        window.close();
    }
};

module.exports = {
    exitApp,
};
