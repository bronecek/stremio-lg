// What the LG remote does in the app, in the shape of src/common/Shortcuts/shortcuts.json, so the
// Settings shortcuts page and the shortcuts modal list the remote instead of the keyboard.
// Combos are labels: `OK`, `↶` (Back), `CH ▼`, the media symbols (`II` is Pause: the UI font has no ⏸);
// arrow key names render as arrows.

const REMOTE_CONTROLS = [
    {
        name: 'remote',
        label: 'WEBOS_REMOTE_GROUP',
        shortcuts: [
            { name: 'remoteClick', label: 'WEBOS_REMOTE_CLICK', combos: [['OK']] },
            { name: 'remoteScroll', label: 'WEBOS_REMOTE_SCROLL', combos: [['◎']] },
            { name: 'remoteBack', label: 'WEBOS_REMOTE_BACK', combos: [['↶']] },
        ],
    },
    {
        name: 'player',
        label: 'SETTINGS_NAV_PLAYER',
        shortcuts: [
            { name: 'remotePlayPause', label: 'WEBOS_REMOTE_PLAY_PAUSE', combos: [['▶'], ['II'], ['OK']] },
            { name: 'remoteSeekForward', label: 'SETTINGS_SHORTCUT_SEEK_FORWARD', combos: [['ArrowRight'], ['⏩']] },
            { name: 'remoteSeekBackward', label: 'SETTINGS_SHORTCUT_SEEK_BACKWARD', combos: [['ArrowLeft'], ['⏪']] },
            { name: 'remoteVolume', label: 'SETTINGS_SHORTCUT_VOLUME', combos: [['ArrowUp'], ['ArrowDown']] },
            { name: 'remoteHide', label: 'WEBOS_REMOTE_HIDE_CONTROLS', combos: [['CH ▼']] },
            { name: 'remoteShow', label: 'WEBOS_REMOTE_SHOW_CONTROLS', combos: [['CH ▲']] },
            { name: 'remoteExit', label: 'WEBOS_REMOTE_EXIT_PLAYER', combos: [['↶'], ['■']] },
        ],
    },
];

const STRINGS = {
    'en-US': {
        WEBOS_REMOTE_GROUP: 'Magic Remote',
        WEBOS_REMOTE_CLICK: 'Click what the cursor points at',
        WEBOS_REMOTE_SCROLL: 'Scroll: turn the wheel',
        WEBOS_REMOTE_BACK: 'Close a menu or dialog, go back; on the Board, exit',
        WEBOS_REMOTE_PLAY_PAUSE: 'Play / pause (OK after an arrow key)',
        WEBOS_REMOTE_HIDE_CONTROLS: 'Hide the controls and the cursor',
        WEBOS_REMOTE_SHOW_CONTROLS: 'Show the controls',
        WEBOS_REMOTE_EXIT_PLAYER: 'Close the menu, leave the player',
        WEBOS_REMOTE_TESTER: 'Test the remote',
        WEBOS_REMOTE_TESTER_HINT: 'Press any button, move or shake the remote. Back closes this window.',
        WEBOS_REMOTE_TESTER_TOGGLE_CURSOR: 'Hide / show the cursor',
    },
    'cs-CZ': {
        WEBOS_REMOTE_GROUP: 'Magic Remote',
        WEBOS_REMOTE_CLICK: 'Kliknout na to, na co míří kurzor',
        WEBOS_REMOTE_SCROLL: 'Posunout: otočit kolečkem',
        WEBOS_REMOTE_BACK: 'Zavřít menu nebo okno, zpět; na nástěnce ukončit',
        WEBOS_REMOTE_PLAY_PAUSE: 'Přehrát / pozastavit (OK po šipce)',
        WEBOS_REMOTE_HIDE_CONTROLS: 'Schovat ovládání i kurzor',
        WEBOS_REMOTE_SHOW_CONTROLS: 'Ukázat ovládání',
        WEBOS_REMOTE_EXIT_PLAYER: 'Zavřít menu, odejít z přehrávače',
        WEBOS_REMOTE_TESTER: 'Otestovat ovladač',
        WEBOS_REMOTE_TESTER_HINT: 'Mačkej tlačítka, hýbej ovladačem nebo s ním zatřes. Zpět okno zavře.',
        WEBOS_REMOTE_TESTER_TOGGLE_CURSOR: 'Schovat / ukázat kurzor',
    },
};

const installRemoteStrings = (i18n) => {
    Object.entries(STRINGS).forEach(([language, strings]) => {
        i18n.addResources(language, 'translation', strings);
    });
};

module.exports = {
    REMOTE_CONTROLS,
    installRemoteStrings,
};
