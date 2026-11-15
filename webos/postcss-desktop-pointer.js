// PostCSS plugin for the webOS build: answers the pointer and hover media features the way a desktop
// with a mouse does, at build time. The Magic Remote drives the app as a mouse, whatever the TV reports.
//
// A query that names `(pointer: coarse)` or `(hover: none)` is dropped, a `(pointer: fine)` or
// `(hover: hover)` condition is removed from its query, and a rule whose query is left empty applies
// unconditionally. Queries that use `not` are left as they are.

const FEATURE = /^\(\s*(any-)?(pointer|hover)\s*:\s*([a-z-]+)\s*\)$/i;
const DESKTOP = { pointer: 'fine', hover: 'hover' };

// true: always matches, false: never matches, null: not a pointer or hover feature.
const answer = (condition) => {
    const match = FEATURE.exec(condition.trim());
    return match === null ? null : DESKTOP[match[2].toLowerCase()] === match[3].toLowerCase();
};

const splitTopLevel = (text, separator) => {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        if (text[i] === ')') depth--;
        if (depth === 0 && text.startsWith(separator, i)) {
            parts.push(text.slice(start, i));
            start = i + separator.length;
            i += separator.length - 1;
        }
    }
    parts.push(text.slice(start));
    return parts.map((part) => part.trim());
};

// Returns the rewritten query, '' when it always matches, or null when it never matches.
const rewriteQuery = (query) => {
    if (/^not\s/i.test(query)) return query;
    const kept = [];
    for (const condition of splitTopLevel(query, ' and ')) {
        const known = answer(condition);
        if (known === false) return null;
        if (known === null) kept.push(condition);
    }
    if (kept.length === 1 && /^only\s+screen$|^screen$|^all$/i.test(kept[0])) return '';
    return kept.join(' and ');
};

module.exports = () => ({
    postcssPlugin: 'webos-desktop-pointer',
    AtRule: {
        media: (rule) => {
            if (!/pointer|hover/i.test(rule.params)) return;
            const queries = splitTopLevel(rule.params, ',').map(rewriteQuery).filter((query) => query !== null);
            if (queries.length === 0) {
                rule.remove();
            } else if (queries.includes('')) {
                rule.replaceWith(rule.nodes);
            } else {
                rule.params = queries.join(', ');
            }
        },
    },
});

module.exports.postcss = true;
