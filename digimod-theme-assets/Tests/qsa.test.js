import { createElement, qsa } from '../scripts/utils';
import { document, parent } from 'jsdom';
import { expect, describe, it } from 'vitest';

/**
 * Tests for qsa utility function found in /src/scripts/public/utils.
 *
 * The `qsa` function returns an array of all elements that match the provided selector within a parent element. 
 * If no parent element is provided, it defaults to the document object.
 *
 * @function
 * 
 * @param {string} selector - The selector to be used to find the matching element.
 * @param {HTMLElement} [parent=document] - The parent element within which to search for the matching element.
 * 
 * @throws {Error} If the `selector` argument is missing, an error with message "A selector argument is required for 
 */
describe('qsa', () => {
	it('throws an error if the selector argument is missing', () => {
	  expect(() => { qsa() }).toThrow('A selector argument is required for the qsa function');
	});
  
	it('returns an array of elements matching the selector within the parent element', () => {
	  const parent = createElement('div');
	  parent.innerHTML = '<div class="test-class"></div><div class="test-class"></div>';
	  const selector = '.test-class';
  
	  const expectedElements = [...parent.querySelectorAll(selector)];
	  expect(qsa(selector, parent)).toEqual(expectedElements);
	});
  
	it('returns an empty array if no elements match the selector within the parent element', () => {
	  const parent = createElement('div');
	  const selector = '.test-class';
  
	  expect(qsa(selector, parent)).toEqual([]);
	});
  
	it('defaults to the document object if the parent argument is not provided', () => {
	  const selector = 'body';
	  const parent = window.document;
  
	  const expectedElements = [...parent.querySelectorAll(selector)];
	  expect(qsa(selector)).toEqual(expectedElements);
	});
  });
  