import { createElement, qs } from '../scripts/utils';
import { document } from 'jsdom';
import { expect, describe, it } from 'vitest';

/**
 * Tests for qs utility function found in /src/scripts/public/utils.
 * 
 * The `qs` function returns the first element that matches the provided selector within a parent element. 
 * If no parent element is provided, it defaults to the document object.
 * 
 * @function
 * 
 * @param {string} selector - The selector to be used to find the matching element.
 * @param {HTMLElement} [parent=document] - The parent element within which to search for the matching element.
 * 
 * @throws {Error} If the `selector` argument is missing, an error with message "A selector argument is required for the qs function" is thrown.
 */
describe('qs', () => {
  it('throws an error if the selector argument is missing', () => {
    expect(() => { qs() }).toThrow('A selector argument is required for the qs function');
  });

  it('returns the first element matching the selector within the parent element', () => {
    const parent = createElement('div');
    parent.innerHTML = '<div class="test-class"></div><div class="test-class"></div>';
    const selector = '.test-class';

    expect(qs(selector, parent)).toBe(parent.querySelector(selector));
  });

  it('returns null if no element matches the selector within the parent element', () => {
    const parent = createElement('div');
    const selector = '.test-class';

    expect(qs(selector, parent)).toBeNull();
  });

  it('defaults to the document object if the parent argument is not provided', () => {
    const selector = 'body';
    const parent = window.document;

    expect(qs(selector)).toBe(parent.querySelector(selector));
  });
});
