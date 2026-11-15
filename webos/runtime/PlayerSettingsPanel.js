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

// A click inside the panel must not close the menu it shows (the player closes them on any other click).
const keepOpen = (event) => {
    event.nativeEvent.subtitlesMenuClosePrevented = true;
    event.nativeEvent.audioMenuClosePrevented = true;
    event.nativeEvent.speedMenuClosePrevented = true;
};

// Transition fades it with a class and waits for its transitionend, so it takes className and ref.
const PlayerSettingsPanel = React.forwardRef(({ className, tab, available, onTabSelected, children }, ref) => {
    const { t } = useTranslation();

    return (
        <div ref={ref} className={classnames(className, styles['player-settings-panel'])} onMouseDown={keepOpen}>
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
            <div className={styles['content']}>
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
