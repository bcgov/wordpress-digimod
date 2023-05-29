/**
 * Tests for the createBreadcrumbs function in the utils module.
 * 
 * @module findParentElementByClass
 * @requires ../scripts/utils
 * @requires vitest
 */
import { findParentElementByClass } from '../scripts/utils';
import { expect, describe, it } from 'vitest';

/**
 *  Tests for the findParentElementByClass function.
 * 
 * @function describe
 * @global
 * @param {string} className - The class name to search for.
 * @returns {void}
 */
describe('findParentElementByClass', () => {
  // Create a DOM element to use as a test fixture.
  const fixture = document.createElement('div');
  fixture.innerHTML = `
    <div class="level-1">
      <div class="level-2">
        <div class="level-3">
          <div class="level-4"></div>
        </div>
      </div>
    </div>
  `;

  it('should return the closest ancestor element with the specified class name', () => {
    // Get the target element
    const target = fixture.querySelector('.level-4');
    
    // Get the expected ancestor element
    const expected = fixture.querySelector('.level-2');

    // Test the function
    expect(findParentElementByClass(target, 'level-2')).toBe(expected);
  });

  it('should return null if the specified class name is not found in any ancestor element', () => {
    // Get the target element
    const target = fixture.querySelector('.level-4');

    // Test the function
    expect(findParentElementByClass(target, 'non-existent-class')).toBeNull();
  });
});
