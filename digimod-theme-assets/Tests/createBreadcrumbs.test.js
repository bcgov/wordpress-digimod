/**
 * Tests for the createBreadcrumbs function in the utils module.
 * 
 * @module createBreadcrumbsTests
 * @requires ../scripts/utils
 * @requires vitest
 */
import { createBreadcrumbs } from '../scripts/utils';
import { expect, describe, it } from 'vitest';

/**
 * Describes the tests for the createBreadcrumbs function.
 * 
 * @function
 * @name describe
 * @param {string} name - The name of the test suite.
 * @param {Function} tests - The tests to be run.
 */
describe('createBreadcrumbs', () => {
  beforeEach(() => {
    // create a fixture for the breadcrumbs container element
    const fixture = `
      <div id="container"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', fixture);
  });

  afterEach(() => {
    // clean up the fixture
    document.body.removeChild(document.getElementById('container'));
  });

  it('should return an HTML element', () => {
    const paths = [      { name: 'Home', url: '/' },      { name: 'Category 1', url: '/category-1' },      { name: 'Subcategory 1', url: '/category-1/subcategory-1' },      { name: 'Product 1', url: '/category-1/subcategory-1/product-1' },    ];
    const breadcrumbsContainer = createBreadcrumbs(paths);
    expect(breadcrumbsContainer instanceof HTMLElement).toBe(true);
  });

  it('should create a breadcrumb for each path in the array', () => {
    const paths = [      { name: 'Home', url: '/' },      { name: 'Category 1', url: '/category-1' },      { name: 'Subcategory 1', url: '/category-1/subcategory-1' },      { name: 'Product 1', url: '/category-1/subcategory-1/product-1' },    ];
    const breadcrumbsContainer = createBreadcrumbs(paths);
    const breadcrumbs = breadcrumbsContainer.querySelectorAll('.aioseo-breadcrumb');
    expect(breadcrumbs.length).toBe(paths.length + 1);
  });

  it('should create a separator between each breadcrumb', () => {
    const paths = [      { name: 'Home', url: '/' },      { name: 'Category 1', url: '/category-1' },      { name: 'Subcategory 1', url: '/category-1/subcategory-1' },      { name: 'Product 1', url: '/category-1/subcategory-1/product-1' },    ];
    const breadcrumbsContainer = createBreadcrumbs(paths);
    const separators = breadcrumbsContainer.querySelectorAll('.aioseo-breadcrumb-separator');
    expect(separators.length).toBe(paths.length);
  });

  it('should create a breadcrumb without a link for the last path', () => {
    const paths = [      { name: 'Home', url: '/' },      { name: 'Category 1', url: '/category-1' },      { name: 'Subcategory 1', url: '/category-1/subcategory-1' },      { name: 'Product 1', url: null },    ];
    const breadcrumbsContainer = createBreadcrumbs(paths);
    const lastBreadcrumb = breadcrumbsContainer.querySelector('.aioseo-breadcrumb:last-of-type');
    expect(lastBreadcrumb.querySelector('a')).toBeNull();
  });
})