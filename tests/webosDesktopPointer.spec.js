const postcss = require(require.resolve('postcss', { paths: [require.resolve('postcss-loader')] }));
const desktopPointer = require('../webos/postcss-desktop-pointer');

const rewrite = (css) => postcss([desktopPointer()]).process(css, { from: undefined }).css.replace(/\s+/g, ' ').trim();

describe('webOS desktop pointer media queries', () => {
    it('applies fine-pointer and hover rules unconditionally', () => {
        expect(rewrite('@media (hover: hover) and (pointer: fine) { .a { color: red } }')).toBe('.a { color: red }');
        expect(rewrite('@media (any-pointer: fine) { .a { color: red } }')).toBe('.a { color: red }');
    });

    it('drops coarse-pointer and no-hover rules', () => {
        expect(rewrite('.b { color: blue } @media (pointer: coarse) { .a { color: red } }')).toBe('.b { color: blue }');
        expect(rewrite('@media (any-pointer: coarse) { .a { display: none } }')).toBe('');
        expect(rewrite('@media (hover: none) { .a { opacity: 1 } }')).toBe('');
    });

    it('keeps the other conditions of a query', () => {
        expect(rewrite('@media only screen and (max-width: 640px) and (orientation: portrait) and (pointer: fine) { .a { color: red } }'))
            .toBe('@media only screen and (max-width: 640px) and (orientation: portrait) { .a { color: red } }');
    });

    it('keeps the queries of a list that can still match', () => {
        expect(rewrite('@media (pointer: coarse), (max-width: 640px) { .a { color: red } }')).toBe('@media (max-width: 640px) { .a { color: red } }');
        expect(rewrite('@media (pointer: coarse), (hover: hover) { .a { color: red } }')).toBe('.a { color: red }');
    });

    it('leaves other media queries alone', () => {
        expect(rewrite('@media (max-width: 640px) { .a { color: red } }')).toBe('@media (max-width: 640px) { .a { color: red } }');
        expect(rewrite('@media not all and (pointer: coarse) { .a { color: red } }')).toBe('@media not all and (pointer: coarse) { .a { color: red } }');
    });
});
