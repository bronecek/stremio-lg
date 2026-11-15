// window.webOS.service.request, the one part of webOSTV.js that stremio-video's WebOsVideo calls: it reads
// and switches the TV player's audio and subtitle tracks through luna://com.webos.media. Written here on top
// of PalmServiceBridge, which the webOS web engine provides, instead of bundling webOSTV.js (Apache-2.0).

const pending = new Set();

const parse = (text) => {
    try {
        return JSON.parse(text);
    } catch (error) {
        return { returnValue: false, errorCode: -1, errorText: `Unreadable service response: ${String(error)}` };
    }
};

const request = (uri, { method = '', parameters = {}, subscribe = false, resubscribe = false, onSuccess, onFailure, onComplete } = {}) => {
    const url = method ? `${uri.replace(/\/$/, '')}/${method}` : uri;
    const bridge = new window.PalmServiceBridge();
    const call = {
        cancel: () => {
            pending.delete(call);
            bridge.cancel?.();
        },
    };

    bridge.onservicecallback = (text) => {
        const result = parse(text);
        if (result.returnValue === false) {
            onFailure?.(result);
        } else {
            onSuccess?.(result);
        }
        onComplete?.(result);
        if (!subscribe) {
            pending.delete(call);
        }
    };

    // The bridge must stay reachable until its answer (or, for a subscription, its cancel) arrives.
    pending.add(call);
    bridge.call(url, JSON.stringify({ ...parameters, ...(subscribe ? { subscribe: true } : {}), ...(resubscribe ? { resubscribe: true } : {}) }));
    return call;
};

const installWebOSService = () => {
    if (typeof window.PalmServiceBridge !== 'function' || window.webOS?.service) return;
    window.webOS = { ...window.webOS, service: { request } };
};

module.exports = {
    installWebOSService,
};
