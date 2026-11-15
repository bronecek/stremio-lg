// Copyright (C) 2017-2023 Smart code 203358507

if (typeof process.env.SENTRY_DSN === 'string') {
    const Sentry = require('@sentry/browser');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const Bowser = require('bowser');
const browser = Bowser.parse(window.navigator?.userAgent || '');
if (browser?.platform?.type === 'desktop') {
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', '');
}

const React = require('react');
const ReactDOM = require('react-dom/client');
const { HashRouter } = require('react-router-dom');
const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const stremioTranslations = require('stremio-translations');
const App = require('./App');
const { default: WebUpdateScreen } = require('./App/WebUpdateScreen');
const { CoreProvider } = require('./core');
const { FileDropProvider, PlatformProvider } = require('./common');
const { name: os } = require('./common/Platform/device');

// The webOS TV app reaches the TV player's track controls through window.webOS.service; `html.webos`
// lets styles tell the TV app apart.
if (process.env.WEBOS) {
    require('stremio-webos/diagnostics').installDiagnostics();
    require('stremio-webos/webOSService').installWebOSService();
    require('stremio-webos/cursorMode').installCursorMode();
    require('stremio-webos/noMotion').installNoMotion();
    document.documentElement.classList.add('webos');
}

const translations = Object.fromEntries(Object.entries(stremioTranslations()).map(([key, value]) => [key, {
    translation: value
}]));

i18n
    .use(initReactI18next)
    .init({
        resources: translations,
        lng: 'en-US',
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    });

if (process.env.WEBOS) {
    require('stremio-webos/remoteControls').installRemoteStrings(i18n);
}

const appInfo = {
    appVersion: process.env.VERSION,
    shellVersion: null,
    platform: globalThis.chrome?.webview ? 'desktop' : 'web',
    os,
    notificationTemplates: ['prompt', 'spotlight-intro']
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <PlatformProvider>
            <CoreProvider appInfo={appInfo}>
                <FileDropProvider>
                    <HashRouter>
                        <>
                            <WebUpdateScreen />
                            <App />
                        </>
                    </HashRouter>
                </FileDropProvider>
            </CoreProvider>
        </PlatformProvider>
    </React.StrictMode>
);
