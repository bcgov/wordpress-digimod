import { addGlobalEventListener, createElement } from '../scripts/utils';
import { expect, describe, beforeEach, it } from 'vitest';
/**
 * Tests for addGlobalEventListener function found in /src/scripts/public/utils.
 * 
 * `addGlobalEventListener` is a utility function that adds an event listener to a parent element
 * and triggers the provided callback if the event target matches the selector.
 *
 * @function
 * @param {string} type - The event type to listen for (e.g. 'click', 'mousedown', etc)
 * @param {string|Element} selector - A CSS selector or an element to match the event target against
 * @param {function} callback - The function to be triggered if the selector matches the event target
 * @param {Element} parent - The parent element to attach the event listener to
 *
 * @throws {Error} - If the selector is not a string or an element
 * @throws {Error} - If the callback is not a function
 */
describe('addGlobalEventListener', () => {
  let parent, selector, type, callback, event;

  beforeEach(() => {
    parent = createElement('div');
    selector = 'button';
    type = 'click';
    callback = vitest.fn();
    event = new Event(type);
  });
  

  it('does not trigger the callback if the event target does not match the selector', () => {
    const div = createElement('div');
    parent.appendChild(div);

    addGlobalEventListener(type, selector, callback, parent);
    div.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('throws an error if the selector is not a string or an element', () => {
    const invalidSelector = 123;

    expect(() => {
      addGlobalEventListener(type, invalidSelector, callback, parent);
    }).toThrowError('Invalid selector: must be CSS selector or an element');
  });

  it('throws an error if the callback is not a function', () => {
    const invalidCallback = 'not a function';

    expect(() => {
      addGlobalEventListener(type, selector, invalidCallback, parent);
    }).toThrowError('Invalid callback provided');
  });
});
