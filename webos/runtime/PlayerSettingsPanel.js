// One panel for the player's subtitles, audio tracks and playback speed on the TV, with a tab for each,
// instead of three small menus over the picture. The control bar's buttons open it on their tab.
const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { Button } = require('stremio/components');
const styles = require('./PlayerSettingsPanel.less');

const TABS = [
    { id: 'subtitles', label: 'SUBTITLES' },
    { id: 'audio', label: 'AUDIO_TRACKS' },
    { id: 'speed', label: 'PLAYBACK_SPEED' },
];

const DIRECTIONS = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
};

const center = (element) => {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
};

// The nearest option in the arrow's direction, the sideways offset counting twice.
const nearest = (panel, from, [dx, dy]) => {
    const [fx, fy] = center(from);
    let best = null;
    let bestScore = Infinity;
    panel.querySelectorAll('[tabindex]:not([tabindex="-1"])').forEach((element) => {
        if (element === from || !element.checkVisibility()) return;
        const [ex, ey] = center(element);
        const along = (ex - fx) * dx + (ey - fy) * dy;
        if (along <= 1) return;
        const score = along + 2 * Math.abs((ex - fx) * dy + (ey - fy) * dx);
        if (score < bestScore) {
            best = element;
            bestScore = score;
        }
    });
    return best;
};

// A click inside the panel must not close the menu it shows (the player closes them on any other click).
const keepOpen = (event) => {
    event.nativeEvent.subtitlesMenuClosePrevented = true;
    event.nativeEvent.audioMenuClosePrevented = true;
    event.nativeEvent.speedMenuClosePrevented = true;
};

// Transition fades it with a class and waits for its transitionend, so it takes className and ref.
const PlayerSettingsPanel = React.forwardRef(({ className, tab, available, onTabSelected, children }, ref) => {
    const { t } = useTranslation();
    const contentRef = React.useRef(null);

    // The arrow keys move between the panel's options and go no further (the player would seek).
    const onKeyDown = React.useCallback((event) => {
        const direction = DIRECTIONS[event.key];
        if (!direction) return;

        event.preventDefault();
        event.stopPropagation();
        const next = nearest(event.currentTarget, event.target, direction);
        next?.focus();
    }, []);

    // The arrow keys start from the chosen option of the shown tab (or its first one).
    React.useEffect(() => {
        const content = contentRef.current;
        if (content === null) return;

        const target = content.querySelector('.selected[tabindex], [class*="selected"][tabindex], [class*="active"][tabindex]') ?? content.querySelector('[tabindex]');
        target?.focus({ preventScroll: false });
    }, [tab]);

    return (
        <div ref={ref} className={classnames(className, styles['player-settings-panel'])} onMouseDown={keepOpen} onKeyDown={onKeyDown}>
            <div className={styles['tabs']}>
                {
                    TABS.map(({ id, label }) => (
                        <Button
                            key={id}
                            className={classnames(styles['tab'], { 'selected': tab === id, 'disabled': !available[id] })}
                            title={t(label)}
                            onClick={() => onTabSelected(id)}
                        >
                            {t(label)}
                        </Button>
                    ))
                }
            </div>
            <div ref={contentRef} className={styles['content']}>
                {children}
            </div>
        </div>
    );
});

PlayerSettingsPanel.displayName = 'PlayerSettingsPanel';

PlayerSettingsPanel.propTypes = {
    className: PropTypes.string,
    tab: PropTypes.oneOf(['subtitles', 'audio', 'speed']).isRequired,
    available: PropTypes.shape({
        subtitles: PropTypes.bool,
        audio: PropTypes.bool,
        speed: PropTypes.bool,
    }).isRequired,
    onTabSelected: PropTypes.func.isRequired,
    children: PropTypes.node,
};

module.exports = PlayerSettingsPanel;
