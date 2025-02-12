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
        const currentMenuItem = document.querySelector(
            'header .current-menu-item'
        );

        if (currentMenuItem) {
            let parentUl = currentMenuItem.closest('ul');
            const currentAncestors = currentMenuItem
                .closest('ul')
                .querySelectorAll('.current-menu-ancestor');
            const currentMenuItemAncestors = currentMenuItem
                .closest('ul')
                .querySelectorAll('.current-menu-item > ul');

            // Add current-menu-ancestor class to parent li in chain
            if (currentMenuItemAncestors) {
                currentMenuItemAncestors.forEach(function (ancestor) {
                    ancestor.classList.add('current-menu-ancestor');
                });
            }
            if (parentUl) {
                while (
                    parentUl !== null &&
                    parentUl.classList.contains(
                        'wp-block-navigation__submenu-container'
                    )
                ) {
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
         * @return {boolean} return true if the current page is a subpage, false otherwise.
         */
        function hasSubPage(urlSubstring) {
            const links = document.querySelectorAll(
                '.aioseo-breadcrumbs .aioseo-breadcrumb a'
            );
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
                const liElements = document.querySelectorAll(
                    `.wp-block-navigation-item a[href*="${urlSubstring}"]`
                );
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
         * @return {string[]} An array of URL substrings representing the top-level navigation items.
         */
        function getTopLevelNavItems() {
            const topLevelLinks = document.querySelectorAll(
                '.wp-block-navigation__container .wp-block-navigation-item a'
            );
            const topLevelNavItems = [];

            topLevelLinks.forEach((link) => {
                const url = new URL(link.href);
                const pathParts = url.pathname
                    .split('/')
                    .filter((part) => part);

                if (pathParts.length > 0) {
                    topLevelNavItems.push(pathParts[0]);
                }
            });

            return topLevelNavItems;
        }

        /**
         * Iterate over the topLevelNavItems array and call highlightMainNavItem for each item.
         */
        const topLevelNavItems = getTopLevelNavItems();

        topLevelNavItems.forEach((item) => {
            highlightMainNavItem(item);
        });


        /**
         * Interrupt the default submenu close behaviour for keyboard navigation.
         */
        /*
		 * Check for menu items being out of viewport and class is needed.
		 */
		const doBoundsCheck = (targetEl) => {

			const container = targetEl;
			const childContainer = container.querySelector('ul');
			const subChildContainer = container.querySelector(
				'.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
			);

			/* Reserve for possible future Polylang additions. */
			// const languageChildContainer = container.querySelector(
			// 	'.language_switcher_options'
			// );

			let bounding = null;

			if (null !== childContainer) {
				bounding = childContainer.getBoundingClientRect();
				childContainer.style.top = '0.85rem';
			}

			const windowWidth =
				window.innerWidth ||
				document.documentElement.clientWidth;

			if (null !== bounding) {
				if (null !== subChildContainer) {
					subChildContainer.style.top = '0.85rem';
				}

				if (bounding.right > windowWidth && childContainer) {
					childContainer.classList.add('is-offscreen');
					childContainer.style.left = `calc(4px - ${childContainer.parentNode.parentNode.offsetWidth}px)`;
					childContainer.style.right = 'auto';
					/* Reserve for possible future Polylang additions. */
					// if (null !== languageChildContainer) {
					// 	languageChildContainer.style.top = '100%';
					// }
					childContainer.style.position = 'absolute';
				}
			}
		}

		/**
		 * Interrupt the default submenu close behaviour for keyboard navigation.
		 */
		const navContainer = document.querySelector('header nav');
        const topLevelMenuItems = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-item > .wp-block-navigation-item__content'
		);
		const topLevelToggles = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle'
		);
		const submenuContainers = document.querySelectorAll('.wp-block-navigation-submenu');
		const nestedToggles = document.querySelectorAll('ul ul .wp-block-navigation-submenu__toggle');

		if (topLevelToggles && topLevelMenuItems) {
            topLevelMenuItems.forEach((menuItem) => {

				menuItem.addEventListener('focus', (event) => {

					// Close all toggles.
					topLevelToggles.forEach((other) => {
						if (other.getAttribute('aria-expanded')) {
							other.setAttribute('aria-expanded', 'false');
						}
						if (nestedToggles) {
							nestedToggles.forEach((other) => {
								other.setAttribute('aria-expanded', 'false');
							});
						}
					});

					event.stopImmediatePropagation(); // block WP focus logic.
				}, true);
			});

            topLevelToggles.forEach((toggle) => {

				toggle.addEventListener('click', (event) => {
					event.stopImmediatePropagation(); // block WP click handler.
					event.preventDefault();           // block default link/button behavior.

					const wasOpen = ('true' === toggle.getAttribute('aria-expanded'));

					if (!wasOpen) {
						toggle.setAttribute('aria-expanded', 'true');
					} else {
						toggle.setAttribute('aria-expanded', 'false');
					}
				}, true);

				toggle.addEventListener('focus', (event) => {

					// Close all toggles.
					topLevelToggles.forEach((other) => {
						if (other.getAttribute('aria-expanded')) {
							other.setAttribute('aria-expanded', 'false');
						}
						if (nestedToggles) {
							nestedToggles.forEach((other) => {
								other.setAttribute('aria-expanded', 'false');
							});
						}
					});

					event.stopImmediatePropagation(); // block WP focus logic.
				}, true);
			});
		}

		if (submenuContainers) {
			submenuContainers.forEach((submenu) => {
				submenu.addEventListener('focusout', (event) => {
					/**
					 * Close all submenus when focus leaves the entire nav container.
					 * relatedTarget is the element receiving focus after the current one loses it.
					 */
					const navContainer = document.querySelector('header nav');

					if (navContainer && !navContainer.contains(event.relatedTarget)) {
						// Focus has gone outside the nav, so close all toggles:
						if (topLevelToggles) {
							topLevelToggles.forEach((toggle) => {
								toggle.setAttribute('aria-expanded', 'false');
							});
						}
						if (nestedToggles) {
							nestedToggles.forEach((toggle) => {
								toggle.setAttribute('aria-expanded', 'false');
							});
						}
					}
					event.stopImmediatePropagation();
				}, true); // capture phase.
			});
		}

		if (nestedToggles) {
			nestedToggles.forEach((toggle) => {

				// Click => close all others, then open this one (if it was closed).
				toggle.addEventListener('click', (event) => {

					/* Reposition submenus if too close to edge of window. */
					let target = event.target;
					if (target.tagName !== 'LI') {
						target = target.closest('li');
					}
					doBoundsCheck(target);

					event.stopImmediatePropagation(); // block WP click handler.
					event.preventDefault();           // block default link/button behavior.

					const wasOpen = ('true' === toggle.getAttribute('aria-expanded'));

					// Close all nested toggles.
					nestedToggles.forEach((other) => {
						other.setAttribute('aria-expanded', 'false');
					});

					if (!wasOpen) {
						toggle.setAttribute('aria-expanded', 'true');
					}
				}, true);

				toggle.addEventListener('focus', () => {
					nestedToggles.forEach((other) => {
						other.setAttribute('aria-expanded', 'false');
					});
				}, true);
			});
		}

		

		if (navContainer) {
			navContainer.addEventListener('keydown', (event) => {
				if (event.key !== 'Escape') {
					return;
				}

				const openToggles = [
					...document.querySelectorAll('.wp-block-navigation-submenu__toggle[aria-expanded="true"]'),
				];

				if (!openToggles.length) {
					return;
				}

				openToggles.forEach((toggle) => {
					toggle.setAttribute('aria-expanded', 'false');

					// If focus is currently inside this submenu, move focus back to the toggle.
					const submenu = toggle.closest('.wp-block-navigation-submenu');
					if (submenu && submenu.contains(document.activeElement)) {
						toggle.focus();
					}
				});

				event.preventDefault();
				event.stopPropagation();
			});
		}

    }, 0);
};

if ('complete' === document.readyState) {
    domReady();
} else {
    document.addEventListener('DOMContentLoaded', domReady);
}
