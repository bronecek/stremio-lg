// Shows or hides the Magic Remote cursor over the app. PalmSystem.setCursor takes "blank" or "default"
// (or an image path) and a hotspot; LG does not document it for TVs, the webOS Web App Manager has it.
// PalmSystem is frozen, so the state asked for is also kept on <html data-webos-cursor> for inspection.
const setCursorHidden = (hidden) => {
    const cursor = hidden ? 'blank' : 'default';
    document.documentElement.dataset.webosCursor = cursor;
    if (typeof window.PalmSystem?.setCursor === 'function') {
        window.PalmSystem.setCursor(cursor, 0, 0);
    }
};

module.exports = {
    setCursorHidden,
};
