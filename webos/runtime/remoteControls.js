// The webOS app's own strings (installRemoteStrings), and what the LG remote does in the app in the shape
// of src/common/Shortcuts/shortcuts.json, so the Settings shortcuts page and the shortcuts modal list the
// remote instead of the keyboard.
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
            { name: 'remoteSettings', label: 'WEBOS_REMOTE_PLAYER_SETTINGS', combos: [['ArrowUp'], ['ArrowDown']] },
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
        WEBOS_REMOTE_HIDE_CONTROLS: 'Hide the controls',
        WEBOS_REMOTE_PLAYER_SETTINGS: 'Subtitles, audio and speed',
        WEBOS_REMOTE_SHOW_CONTROLS: 'Show the controls',
        WEBOS_REMOTE_EXIT_PLAYER: 'Close the menu, leave the player',
        WEBOS_REMOTE_TESTER: 'Test the remote',
        WEBOS_REMOTE_TESTER_HINT: 'Press any button, move or shake the remote. Back closes this window.',
        WEBOS_SYNC_ADDONS: 'Sync addons from account',
        WEBOS_SYNC_ADDONS_STARTED: 'Syncing addons from your account…',
        WEBOS_QR_LOGIN: 'Log in with your phone',
        WEBOS_QR_LOGIN_SCAN: 'Scan the QR code with your phone and log in there.',
        WEBOS_QR_LOGIN_OR_OPEN: 'Or open {{link}} and enter this code:',
        WEBOS_QR_LOGIN_WAITING: 'Waiting for the phone…',
        WEBOS_QR_LOGIN_SIGNING_IN: 'Logging in…',
        WEBOS_QR_LOGIN_LOADING: 'Getting a code…',
        WEBOS_QR_LOGIN_FAILED: 'Could not get a code. Try a new one.',
        WEBOS_QR_LOGIN_NEW_CODE: 'New code',
    },
    'cs-CZ': {
        WEBOS_REMOTE_GROUP: 'Magic Remote',
        WEBOS_REMOTE_CLICK: 'Kliknout na to, na co míří kurzor',
        WEBOS_REMOTE_SCROLL: 'Posunout: otočit kolečkem',
        WEBOS_REMOTE_BACK: 'Zavřít menu nebo okno, zpět; na nástěnce ukončit',
        WEBOS_REMOTE_PLAY_PAUSE: 'Přehrát / pozastavit (OK po šipce)',
        WEBOS_REMOTE_HIDE_CONTROLS: 'Schovat ovládání',
        WEBOS_REMOTE_PLAYER_SETTINGS: 'Titulky, zvuk a rychlost',
        WEBOS_REMOTE_SHOW_CONTROLS: 'Ukázat ovládání',
        WEBOS_REMOTE_EXIT_PLAYER: 'Zavřít menu, odejít z přehrávače',
        WEBOS_REMOTE_TESTER: 'Otestovat ovladač',
        WEBOS_REMOTE_TESTER_HINT: 'Mačkej tlačítka, hýbej ovladačem nebo s ním zatřes. Zpět okno zavře.',
        WEBOS_SYNC_ADDONS: 'Synchronizovat doplňky z účtu',
        WEBOS_SYNC_ADDONS_STARTED: 'Synchronizuji doplňky z účtu…',
        WEBOS_QR_LOGIN: 'Přihlásit se telefonem',
        WEBOS_QR_LOGIN_SCAN: 'Naskenuj QR kód telefonem a přihlas se tam.',
        WEBOS_QR_LOGIN_OR_OPEN: 'Nebo otevři {{link}} a zadej tento kód:',
        WEBOS_QR_LOGIN_WAITING: 'Čekám na telefon…',
        WEBOS_QR_LOGIN_SIGNING_IN: 'Přihlašuji…',
        WEBOS_QR_LOGIN_LOADING: 'Získávám kód…',
        WEBOS_QR_LOGIN_FAILED: 'Kód se nepodařilo získat. Zkus nový.',
        WEBOS_QR_LOGIN_NEW_CODE: 'Nový kód',
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
