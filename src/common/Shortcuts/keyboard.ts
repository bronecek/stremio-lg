import { isWebOS, name } from 'stremio/common/Platform/device';

const PRIMARY_MODIFIER = ['macos', 'ios', 'visionos'].includes(name) ? 'Meta' : 'Ctrl';

const KEY_CODE_MAP: Record<number, string> = {
    8: 'Backspace',
    27: 'Escape',
    32: 'Space',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    107: '+',
    109: '-',
    122: 'F11',
    187: '=',
    189: '-',
    191: '/',
    219: '[',
    221: ']',
};

const KEY_MAP: Record<string, string> = {
    ' ': 'Space',
    Spacebar: 'Space',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
};

const keyFromKeyCode = (keyCode: number) => {
    if (KEY_CODE_MAP[keyCode]) {
        return KEY_CODE_MAP[keyCode];
    }

    if (keyCode >= 48 && keyCode <= 57) {
        return String.fromCharCode(keyCode);
    }

    if (keyCode >= 65 && keyCode <= 90) {
        return String.fromCharCode(keyCode);
    }

    if (keyCode >= 96 && keyCode <= 105) {
        return String(keyCode - 96);
    }

    return null;
};

const normalizeKeyboardKey = ({ key, keyCode, which }: KeyboardEvent) => {
    const mappedKey = KEY_MAP[key] ?? key;
    if (mappedKey && mappedKey !== 'Unidentified') {
        return mappedKey.length === 1 ? mappedKey.toUpperCase() : mappedKey;
    }

    return keyFromKeyCode(keyCode || which) ?? mappedKey;
};

const getKeyboardShortcutKey = (event: KeyboardEvent) => {
    return event.code && event.code !== 'Unidentified' ? event.code : normalizeKeyboardKey(event);
};

const getKeyboardShortcutKeys = (event: KeyboardEvent) => {
    const normalizedKey = normalizeKeyboardKey(event);
    const code = event.code !== 'Unidentified' ? event.code : '';
    return code && code !== normalizedKey ? [code, normalizedKey] : [normalizedKey];
};

type MediaKeyAction = 'play' | 'pause' | 'stop' | 'fast-forward' | 'rewind';

// Play-pause and next-track are left out: browsers route those keys to the Media Session handlers.
const MEDIA_KEY_ACTIONS: Record<string, MediaKeyAction> = {
    MediaPlay: 'play',
    MediaPause: 'pause',
    MediaStop: 'stop',
    MediaFastForward: 'fast-forward',
    MediaRewind: 'rewind',
};

// The LG remote's media keys arrive as `Unidentified` with these key codes (19 is Pause/Break elsewhere).
const WEBOS_MEDIA_KEY_CODES: Record<number, MediaKeyAction> = {
    415: 'play',
    19: 'pause',
    413: 'stop',
    417: 'fast-forward',
    412: 'rewind',
};

const getMediaKeyAction = (event: KeyboardEvent): MediaKeyAction | null => {
    return MEDIA_KEY_ACTIONS[event.key] ?? (isWebOS ? WEBOS_MEDIA_KEY_CODES[event.keyCode] ?? null : null);
};

export {
    PRIMARY_MODIFIER,
    getKeyboardShortcutKey,
    getKeyboardShortcutKeys,
    getMediaKeyAction,
};
