import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShortcuts } from 'stremio/common';
import Combos from 'stremio/components/ShortcutsGroup/Combos';
import { Group, Row, RowButton } from '../components';

// The webOS TV app's remote tester; the web build leaves this module out.
const RemoteTester = process.env.WEBOS ? require('stremio-webos/RemoteTester') : null;

const Shortcuts = () => {
    const { t } = useTranslation();
    const { grouped } = useShortcuts();
    const [testerOpen, setTesterOpen] = React.useState(false);

    return (
        <React.Fragment>
            {
                grouped.map(({ name, label, shortcuts }) => (
                    <Group key={name} title={t(label)}>
                        {
                            shortcuts.map((shortcut) => (
                                <Row key={shortcut.name} rowId={shortcut.name} label={t(shortcut.label)} variant={'keys'}>
                                    <Combos combos={shortcut.combos} />
                                </Row>
                            ))
                        }
                    </Group>
                ))
            }
            {
                RemoteTester !== null &&
                    <Group title={t('WEBOS_REMOTE_TESTER')}>
                        <RowButton label={t('WEBOS_REMOTE_TESTER')} onClick={() => setTesterOpen(true)} />
                        {testerOpen && <RemoteTester onClose={() => setTesterOpen(false)} />}
                    </Group>
            }
        </React.Fragment>
    );
};

export default Shortcuts;
