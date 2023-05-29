import { createElement } from '../scripts/utils';
import { document } from 'jsdom';
import { expect, describe, it } from 'vitest';

/**
 * Tests for createElement function found in /src/scripts/public/utils.
 *
 * `createElement` creates an HTML element with the specified type, class, dataset, text, and other options.
 *
 * @function
 * @param {string} type - The type of the HTML element to be created.
 * @param {Object} [options] - An object that contains the class, dataset, text, and other options.
 * @param {string} [options.class] - A string that specifies the class(es) of the element.
 * @param {Object} [options.dataset] - An object that specifies the data attributes of the element.
 * @param {string} [options.text] - A string that specifies the text content of the element.
 *
 * @returns {HTMLElement} - Returns the newly created HTML element.
 */

describe('createElement', () => {
  it('creates an HTML element with the given type', () => {
    const element = createElement('div');
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.nodeName).toBe('DIV');
  });

  it('sets the class of the element based on the "class" option', () => {
    const className = 'test-class';
    const element = createElement('div', { class: className });
    expect(element.classList.contains(className)).toBe(true);
  });

  it('sets multiple classes on the element based on the "class" option as a single space-separated string', () => {
    const className1 = 'test-class-1';
    const className2 = 'test-class-2';
    const element = createElement('div', { class: `${className1} ${className2}` });
    expect(element.classList.contains(className1)).toBe(true);
    expect(element.classList.contains(className2)).toBe(true);
  });

  it('sets data attributes on the element based on the "dataset" option', () => {
    const dataKey = 'testKey';
    const dataValue = 'testValue';
    const element = createElement('div', { dataset: { [dataKey]: dataValue } });
    expect(element.dataset[dataKey]).toBe(dataValue);
  });

  it('sets the text content of the element based on the "text" option', () => {
    const text = 'test text content';
    const element = createElement('div', { text });
    expect(element.textContent).toBe(text);
  });

  it('sets the html content of the element based on the "html" option', () => {
    const html = '<p>test <span>html</span> content</p>';
    const element = createElement('div', { html });
    expect(element.innerHTML).toBe(html);
  });

  it('sets attributes on the element for all other options', () => {
    const attributeKey = 'test-attribute';
    const attributeValue = 'test-value';
    const element = createElement('div', { [attributeKey]: attributeValue });
    expect(element.getAttribute(attributeKey)).toBe(attributeValue);
  });

  it('ignores blank class names in the "class" option', () => {
    const className = 'test-class';
    const element = createElement('div', { class: `   ${className}   ` });
    expect(element.classList.contains(className)).toBe(true);
  });
});
