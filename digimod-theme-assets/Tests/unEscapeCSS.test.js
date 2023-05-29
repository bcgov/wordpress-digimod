import { unEscapeCSS } from '../scripts/utils';
import { expect, describe, it } from 'vitest';
/**
 * Tests for unEscapeCSS utility function found in /src/scripts/public/utils.
 * 
 * The `unEscapeCSS` function replaces escaped characters in a CSS string with their unescaped equivalents.
 * 
 * @function
 */
describe('unEscapeCSS', () => {
	it('replaces &gt; with >', () => {
		const cssStr = 'body &gt; h1 { font-size: 2em; }';
		const expectedResult = 'body > h1 { font-size: 2em; }';
		expect(unEscapeCSS(cssStr)).toBe(expectedResult);
	});

	it('replaces &quot; with "', () => {
		const cssStr = 'body h1 { font-family: &quot;Open Sans&quot;, sans-serif; }';
		const expectedResult = 'body h1 { font-family: "Open Sans", sans-serif; }';
		expect(unEscapeCSS(cssStr)).toBe(expectedResult);
	});

	it('replaces &#39; with &apos;', () => {
		const cssStr = 'body h1 { font-style: italic; content: &#39;Hello, world!&#39;; }';
		const expectedResult = 'body h1 { font-style: italic; content: \'Hello, world!\'; }';
		expect(unEscapeCSS(cssStr)).toBe(expectedResult);
	});

	it('replaces &amp; with &', () => {
		const cssStr = 'body &amp; h1 { color: blue; }';
		const expectedResult = 'body & h1 { color: blue; }';
		expect(unEscapeCSS(cssStr)).toBe(expectedResult);
	});
});