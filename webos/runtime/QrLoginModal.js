// Sign in without typing on the TV: stremio-core's auth_link model gets a code from link.stremio.com,
// the user opens its link (or scans the QR code) on a phone and signs in there, and the TV, asking every
// few seconds, receives the account's key and signs in with it (LoginWithToken).
const React = require('react');
const PropTypes = require('prop-types');
const { useTranslation } = require('react-i18next');
const { useCore } = require('stremio/core');
const { useModelState, withCoreSuspender } = require('stremio/common');
const { ModalDialog } = require('stremio/components');

const READ_INTERVAL = 3000;
// Loading the model asks link.stremio.com for a new code.
const CREATE_CODE = { action: 'Load', args: { model: 'Link' } };
const READ_DATA = { action: 'Link', args: { action: 'ReadData' } };

const STYLES = {
    content: { display: 'flex', alignItems: 'center', gap: '3rem', padding: '1rem 0' },
    qr: { width: '18rem', height: '18rem', borderRadius: '1rem', background: '#fff', padding: '0.75rem', flex: 'none' },
    text: { display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '1.4rem', lineHeight: 1.5 },
    code: { fontSize: '3rem', fontWeight: 600, letterSpacing: '0.4rem' },
};

// link.stremio.com answers with the QR image's URL; accept a data URL or bare base64 too.
const asImage = (qrcode) => /^(https?|data):/.test(qrcode) ? qrcode : `data:image/png;base64,${qrcode}`;

const QrLoginModal = ({ onCloseRequest }) => {
    const { t } = useTranslation();
    const core = useCore();
    const link = useModelState({ model: 'auth_link', action: CREATE_CODE });
    const code = link?.code?.type === 'Ready' ? link.code.content : null;
    const codeFailed = link?.code?.type === 'Err';
    const authKey = link?.data?.type === 'Ready' ? link.data.content.authKey : null;

    // The phone may take a while: keep asking until the account's key arrives.
    React.useEffect(() => {
        if (code === null || authKey !== null) return;

        const interval = setInterval(() => core.transport.dispatch(READ_DATA, 'auth_link'), READ_INTERVAL);
        return () => clearInterval(interval);
    }, [code, authKey, core.transport]);

    React.useEffect(() => {
        if (authKey === null) return;

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'Authenticate',
                args: {
                    type: 'LoginWithToken',
                    token: authKey
                }
            }
        });
    }, [authKey, core.transport]);

    const newCode = React.useCallback(() => {
        core.transport.dispatch(CREATE_CODE, 'auth_link');
    }, [core.transport]);

    const buttons = React.useMemo(() => [
        { label: t('WEBOS_QR_LOGIN_NEW_CODE'), props: { onClick: newCode } },
        { label: t('BUTTON_CANCEL'), props: { onClick: onCloseRequest } },
    ], [t, newCode, onCloseRequest]);

    return (
        <ModalDialog title={t('WEBOS_QR_LOGIN')} buttons={buttons} onCloseRequest={onCloseRequest}>
            {
                code !== null ?
                    <div style={STYLES.content}>
                        <img style={STYLES.qr} src={asImage(code.qrcode)} alt={code.link} />
                        <div style={STYLES.text}>
                            <div>{t('WEBOS_QR_LOGIN_SCAN')}</div>
                            <div>{t('WEBOS_QR_LOGIN_OR_OPEN', { link: code.link })}</div>
                            <div style={STYLES.code}>{code.code}</div>
                            <div>{authKey !== null ? t('WEBOS_QR_LOGIN_SIGNING_IN') : t('WEBOS_QR_LOGIN_WAITING')}</div>
                        </div>
                    </div>
                    :
                    <div style={STYLES.text}>{codeFailed ? t('WEBOS_QR_LOGIN_FAILED') : t('WEBOS_QR_LOGIN_LOADING')}</div>
            }
        </ModalDialog>
    );
};

QrLoginModal.propTypes = {
    onCloseRequest: PropTypes.func,
};

// Its own suspender: reading the auth_link model for the first time suspends this modal only, not the
// whole intro page (which would remount and drop the open modal).
module.exports = withCoreSuspender(QrLoginModal);
