import { qsa } from '../utils';
/**
 * Navigation DOM manipulation.
 * 
 * Note: as this runs on all pages be sure to null check all elements before use.
 * 
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function () {

		/**
		 * Navigation menu: add ancestor class to sub-menu page menu parents.
		 * Link checking and classing.
		 */
		const currentMenuItem = document.querySelector('header .current-menu-item');

		if (currentMenuItem) {
			let parentUl = currentMenuItem.closest('ul');
			const currentAncestors = currentMenuItem.closest('ul').querySelectorAll('.current-menu-ancestor');
			const currentMenuItemAncestors = currentMenuItem.closest('ul').querySelectorAll('.current-menu-item > ul');

			// Add current-menu-ancestor class to parent li in chain
			if (currentMenuItemAncestors) {
				currentMenuItemAncestors.forEach(function (ancestor) {
					ancestor.classList.add('current-menu-ancestor');
				});
			}
			if (parentUl) {
				while (parentUl !== null && parentUl.classList.contains('wp-block-navigation__submenu-container')) {
					parentUl.parentNode.classList.add('current-menu-ancestor');
					parentUl = parentUl.parentNode.closest('ul');
				}
			}
			if (currentAncestors) {
				// Add current-menu-ancestor class to li containing current-menu-item's ul
				currentAncestors.forEach(function (ancestor) {
					ancestor.classList.add('current-menu-ancestor');
				});

			}
		}

		/**
		 * Check if the current page is a subpage of the given top-level navigation item.
		 *
		 * @param {string} urlSubstring - The URL substring used to identify the top-level navigation item.
		 * @returns {boolean} Returns true if the current page is a subpage, false otherwise.
		 */
		function hasSubPage(urlSubstring) {
			const links = document.querySelectorAll('.aioseo-breadcrumbs .aioseo-breadcrumb a');
			for (const link of links) {
				if (link.href.includes(urlSubstring)) {
					return true;
				}
			}
			return false;
		}

		/**
		 * Highlight the main navigation item if the current page is a subpage of the given top-level navigation item.
		 *
		 * @param {string} urlSubstring - The URL substring used to identify the top-level navigation item.
		 */
		function highlightMainNavItem(urlSubstring) {
			if (hasSubPage(urlSubstring)) {
				const liElements = document.querySelectorAll(`.wp-block-navigation-item a[href*="${urlSubstring}"]`);
				if (liElements && liElements.length > 0) {
					const firstLiElement = liElements[0];
					const currentUrl = window.location.href;

					if (firstLiElement.href !== currentUrl) {
						const lastLiElement = liElements[liElements.length - 1];
						lastLiElement.classList.add('current-menu-ancestor');
					}
				}
			}
		}

		/**
		 * Get the top-level navigation items by extracting the relevant parts of their href attributes.
		 *
		 * @returns {string[]} An array of URL substrings representing the top-level navigation items.
		 */
		function getTopLevelNavItems() {
			const topLevelLinks = document.querySelectorAll('.wp-block-navigation__container .wp-block-navigation-item a');
			const topLevelNavItems = [];

			topLevelLinks.forEach((link) => {
				const url = new URL(link.href);
				const pathParts = url.pathname.split('/').filter((part) => part);

				if (pathParts.length > 0) {
					topLevelNavItems.push(pathParts[0]);
				}
			});

			return topLevelNavItems;
		}

		// Iterate over the topLevelNavItems array and call highlightMainNavItem for each item.
		const topLevelNavItems = getTopLevelNavItems();

		topLevelNavItems.forEach((item) => {
			highlightMainNavItem(item);
		});


	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}