/**
 * Navigation DOM manipulation.
 *
 * Note: as this runs on all pages be sure to null check all elements before use.
 */
const domReady = () => {
	setTimeout(() => {
		/**
		 * Navigation menu: Add ancestor class to sub-menu page menu parents.
		 */
		const currentMenuItem = document.querySelector('header .current-menu-item');

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
				currentMenuItemAncestors.forEach((ancestor) => {
					ancestor.classList.add('current-menu-ancestor');
				});
			}
			if (parentUl) {
				while (
					parentUl !== null &&
					parentUl.classList.contains('wp-block-navigation__submenu-container')
				) {
					parentUl.parentNode.classList.add('current-menu-ancestor');
					parentUl = parentUl.parentNode.closest('ul');
				}
			}
			if (currentAncestors) {
				// Add current-menu-ancestor class to li containing current-menu-item's ul
				currentAncestors.forEach((ancestor) => {
					ancestor.classList.add('current-menu-ancestor');
				});
			}
		}

		/**
		 * Check if the current page is a subpage of the given top-level navigation item.
		 */
		const hasSubPage = (urlSubstring) => {
			const links = document.querySelectorAll(
				'.aioseo-breadcrumbs .aioseo-breadcrumb a'
			);
			for (const link of links) {
				if (link.href.includes(urlSubstring)) {
					return true;
				}
			}
			return false;
		};

		/**
		 * Highlight the main navigation item if the current page is a subpage of the given top-level navigation item.
		 */
		const highlightMainNavItem = (urlSubstring) => {
			if (hasSubPage(urlSubstring)) {
				const liElements = document.querySelectorAll(
					`.wp-block-navigation-item a[href*="${urlSubstring}"]`
				);
				if (liElements && liElements.length > 0) {
					const firstLiElement = liElements[0];
					const currentUrl = window.location.href;

					// Only mark if not the actual current page link
					if (firstLiElement.href !== currentUrl) {
						const lastLiElement = liElements[liElements.length - 1];
						lastLiElement.classList.add('current-menu-ancestor');
					}
				}
			}
		};

		/**
		 * Get the top-level navigation items by extracting parts of their href attributes.
		 */
		const getTopLevelNavItems = () => {
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
		};

		/**
		 * Highlight top-level menu items if current page is a subpage.
		 */
		const topLevelNavItems = getTopLevelNavItems();
		topLevelNavItems.forEach((item) => {
			highlightMainNavItem(item);
		});

		/**
		 * Check for menu items being out of viewport and adjust positioning if needed.
		 */
		const doBoundsCheck = (targetEl) => {
			const container = targetEl;
			const childContainer = container.querySelector('ul');
			const subChildContainer = container.querySelector(
				'.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
			);

			let bounding = null;
			if (childContainer) {
				bounding = childContainer.getBoundingClientRect();
				// Slight offset from parent
				//childContainer.style.top = '0.85rem';
			}

			const windowWidth = window.innerWidth || document.documentElement.clientWidth;

			if (bounding) {
				if (subChildContainer) {
					subChildContainer.style.top = '0.85rem';
				}

				if (bounding.right > windowWidth && childContainer) {
					childContainer.classList.add('is-offscreen');
					childContainer.style.left = `calc(4px - ${ childContainer.parentNode.parentNode.offsetWidth }px)`;
					childContainer.style.right = 'auto';
					childContainer.style.position = 'absolute';
				}
			}
		};

		// Main nav container
		const navContainer = document.querySelector('header nav');
		// Top-level items and toggles
		const topLevelMenuItems = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-item > .wp-block-navigation-item__content'
		);
		const topLevelToggles = document.querySelectorAll(
			'.wp-block-navigation__container > .wp-block-navigation-submenu > .wp-block-navigation-submenu__toggle'
		);

		// Submenus & nested toggles
		const submenuContainers = document.querySelectorAll('.wp-block-navigation-submenu');
		const nestedToggles = document.querySelectorAll(
			'ul ul .wp-block-navigation-submenu__toggle'
		);

		/**
		 * Assign ARIA roles:
		 * - role="menu" on the nav container (or "menubar" if it’s a horizontal menubar).
		 * - role="menuitem" on anchors/toggles.
		 */
		if (navContainer) {
			navContainer.setAttribute('role', 'menu');
			const menuLinksAndButtons = navContainer.querySelectorAll('a, button');
			menuLinksAndButtons.forEach((el) => {
				el.setAttribute('role', 'menuitem');
			});
		}

		/**
		 * Interrupt default focus logic for top-level items: close other submenus on focus, etc.
		 */
		if (topLevelToggles && topLevelMenuItems) {
			topLevelMenuItems.forEach((menuItem) => {
				menuItem.addEventListener(
					'focus',
					(event) => {
						// Close all toggles
						topLevelToggles.forEach((other) => {
							if (other.getAttribute('aria-expanded')) {
								other.setAttribute('aria-expanded', 'false');
							}
						});
						if (nestedToggles) {
							nestedToggles.forEach((sub) => {
								sub.setAttribute('aria-expanded', 'false');
							});
						}
						event.stopImmediatePropagation(); // block WP focus logic
					},
					true
				);
			});

			topLevelToggles.forEach((toggle) => {
				toggle.addEventListener(
					'click',
					(event) => {
						event.stopImmediatePropagation(); // block WP click handler
						event.preventDefault(); // block default link/button behavior

						const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

						if (!wasOpen) {
							toggle.setAttribute('aria-expanded', 'true');
						} else {
							toggle.setAttribute('aria-expanded', 'false');
						}
					},
					true
				);

				toggle.addEventListener(
					'focus',
					(event) => {
						// Close all toggles
						topLevelToggles.forEach((other) => {
							if (other.getAttribute('aria-expanded')) {
								other.setAttribute('aria-expanded', 'false');
							}
						});
						if (nestedToggles) {
							nestedToggles.forEach((sub) => {
								sub.setAttribute('aria-expanded', 'false');
							});
						}
						event.stopImmediatePropagation(); // block WP focus logic
					},
					true
				);
			});
		}

		/**
		 * Close all submenus when focus leaves the entire nav container.
		 */
		if (submenuContainers) {
			submenuContainers.forEach((submenu) => {
				submenu.addEventListener(
					'focusout',
					(event) => {
						const navContainerFocus = document.querySelector('header nav');
						if (
							navContainerFocus &&
							!navContainerFocus.contains(event.relatedTarget)
						) {
							// Focus went outside nav
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
					},
					true
				);
			});
		}

		/**
		 * Nested toggles: close all others on click, then open the clicked one.
		 */
		if (nestedToggles) {
			nestedToggles.forEach((toggle) => {
				toggle.addEventListener(
					'click',
					(event) => {
						let target = event.target;
						if (target.tagName !== 'LI') {
							target = target.closest('li');
						}
						doBoundsCheck(target);

						event.stopImmediatePropagation();
						event.preventDefault();

						const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
						// Close all nested toggles.
						nestedToggles.forEach((other) => {
							other.setAttribute('aria-expanded', 'false');
						});
						// Open this one if it was closed.
						if (!wasOpen) {
							toggle.setAttribute('aria-expanded', 'true');
						}
					},
					true
				);

				toggle.addEventListener(
					'focus',
					() => {
						nestedToggles.forEach((other) => {
							other.setAttribute('aria-expanded', 'false');
						});
					},
					true
				);
			});
		}

		/**
		 * ARIA Menu Helpers.
		 */
		const focusMenuItem = (items, index) => {
			// Simple wrap.
			if (index < 0) {
				index = items.length - 1;
			} else if (index >= items.length) {
				index = 0;
			}
			items[index].focus();
		};

		const openSubmenu = (menuItemEl) => {
			const submenu = menuItemEl
				.closest('.wp-block-navigation-submenu')
			const toggle = menuItemEl
				.closest('.wp-block-navigation-submenu')
				?.querySelector('.wp-block-navigation-submenu__toggle');
			if (toggle) {
				toggle.setAttribute('aria-expanded', 'true');
				const submenuItems = toggle
					.closest('.wp-block-navigation-submenu')
					.querySelectorAll('button[role="menuitem"]');
				if (submenuItems.length) {
					submenuItems[0].focus();
					doBoundsCheck(submenu);
				}
			}
		};

		const closeSubmenu = (menuItemEl, moveFocusToParent = false) => {
			const submenu = menuItemEl.closest('.wp-block-navigation-submenu');
			if (!submenu) return;
		
			// Close all toggles that are open within this submenu.
			const openToggles = submenu.querySelectorAll(
				'.wp-block-navigation-submenu__toggle[aria-expanded="true"]'
			);
			openToggles.forEach((toggle) => {
				toggle.setAttribute('aria-expanded', 'false');
			});
		
			if (moveFocusToParent) {
				const parentLi = submenu.closest('li');
				if (parentLi) {
					const parentToggle = parentLi.querySelector('button[role="menuitem"]');
					const parentAnchor = parentLi.querySelector('a[role="menuitem"]');
					if (parentToggle) {
						parentToggle.focus();
					} 
						if (parentAnchor) {
							parentAnchor.focus();
						}
					
				}
			}
		};

		/**
		 * Move focus to the fiirst menu item in the same <ul> container as `currentItem`.
		 */
		const focusFirstElementOfMenu = (currentItem) => {
			const parentUl = currentItem.closest('ul');
			if (!parentUl) return;

			const firstLi = parentUl.querySelector('li');
			if (!firstLi) return;

			const firstMenuItem = firstLi.querySelector('[role="menuitem"]');
			if (firstMenuItem) {
				firstMenuItem.focus();
			}
		};

		/**
		 * Move the focus into the first item of a sibling submenu.
		 */
		const focusFirstElementOfSiblingMenu = (currentItem, event) => {
			event.preventDefault();
			const parentLi = currentItem.closest('li');
			if (!parentLi) return;

			let siblingUl = currentItem.nextElementSibling;
			while (siblingUl && !siblingUl.classList.contains('wp-block-navigation__submenu-container')) {
				siblingUl = siblingUl.nextElementSibling;
			}
			if (!siblingUl) {
				return; // No sibling submenu found.
			}

			const firstMenuItem = siblingUl.querySelector('[role="menuitem"]');
			if (firstMenuItem) {
				firstMenuItem.focus();
			}
		};

		/**
		 * Move focus to the last menu item in the same <ul> container as `currentItem`.
		 */
		const focusLastElementOfMenu = (currentItem) => {
			const parentUl = currentItem.closest('ul');
			if (!parentUl) return;

			const directLis = Array.from(parentUl.children).filter(
				(el) => el.tagName.toLowerCase() === 'li'
			);
			if (!directLis.length) return;

			const lastLi = directLis[directLis.length - 1];

			const directMenuItems = Array.from(lastLi.children).filter(
				(el) => el.getAttribute('role') === 'menuitem'
			);
			if (!directMenuItems.length) return;

			const lastMenuItem = directMenuItems[directMenuItems.length - 1];
			lastMenuItem.focus();
		};


		/**
		 * Move "down" through siblings in an anchor → button → anchor → button pattern.
		 */
		const moveDownSiblingMenu = (currentItem) => {
			const parentLi = currentItem.closest('li');
			if (!parentLi) return;

			if (currentItem.localName === 'a') {
				const sameLiButton = parentLi.querySelector('button[role="menuitem"]');
				// If we find a different button in the same <li>, focus it and stop.
				if (sameLiButton && sameLiButton !== currentItem) {
					sameLiButton.focus();
					return;
				}
			}

			let siblingLi = parentLi.nextElementSibling;
			while (siblingLi && siblingLi.tagName.toLowerCase() !== 'li') {
				siblingLi = siblingLi.nextElementSibling;
			}
			if (!siblingLi) return;

			const siblingAnchor = siblingLi.querySelector('a[role="menuitem"]');
			if (siblingAnchor) {
				siblingAnchor.focus();
			}
		};



		const moveUpSiblingMenu = (currentItem) => {
			const parentLi = currentItem.closest('li');
			if (!parentLi) return;

			let siblingLi = parentLi.previousElementSibling;
			while (siblingLi && siblingLi.tagName.toLowerCase() !== 'li') {
				siblingLi = siblingLi.previousElementSibling;
			}

			if (!siblingLi) return;

			const currentItemMenuItem = parentLi.querySelector('a[role="menuitem"]');
			const itemMenuItem = siblingLi.querySelector('a[role="menuitem"]');
			const buttonMenuItem = siblingLi.querySelector('button[role="menuitem"]');
			if ('a' === currentItem.localName) {
				if (buttonMenuItem) {
					buttonMenuItem.focus();
				} else {
					itemMenuItem.focus();
				}
			} else {
				currentItemMenuItem.focus();
			}
		};


		/**
		 * Returns the .wp-block-navigation-submenu__toggle if `menuItemEl` has a parent
		 * submenu container. Otherwise returns null.
		 */
		const getSubmenuToggle = (menuItemEl) => {
			const submenu = menuItemEl.closest('.wp-block-navigation-submenu');
			if (!submenu) return null;
			return submenu.querySelector('.wp-block-navigation-submenu__toggle');
		};

		if (navContainer) {
			const allMenuItems = Array.from(
				navContainer.querySelectorAll('[role="menuitem"]')
			);

			/*
			 * Top-level items: direct children of the main nav container.
			 * Typically something like: ul.wp-block-navigation__container > li > [role="menuitem"].
			 */
			const topLevelItems = Array.from(
				navContainer.querySelectorAll(
					'.wp-block-navigation__container > li > *[role="menuitem"]'
				)
			);

			navContainer.addEventListener('keydown', (event) => {

				const key = event.key;
				const currentItem = document.activeElement;

				if (!allMenuItems.includes(currentItem)) {
					return; // Focus isn't on a recognized menu item.
				}

				// Prevent browser defaults for these navigation keys.
				if (
					key === 'ArrowDown' ||
					key === 'ArrowUp' ||
					key === 'ArrowLeft' ||
					key === 'ArrowRight' ||
					key === 'Home' ||
					key === 'End'
				) {
					event.preventDefault();
				}

				const currentIndex = allMenuItems.indexOf(currentItem);
				switch (key) {
					case 'Escape': {
						const openToggles = [
							...document.querySelectorAll(
								'.wp-block-navigation-submenu__toggle[aria-expanded="true"]'
							),
						];
						if (!openToggles.length) return;
						openToggles.forEach((toggle) => {
							toggle.setAttribute('aria-expanded', 'false');
							const submenu = toggle.closest('.wp-block-navigation-submenu');
							if (submenu && submenu.contains(document.activeElement)) {
								toggle.focus();
							}
						});
						event.stopPropagation();
						break;
					}
					// case 'Enter': {
					// 	if (topLevelItems.includes(currentItem)) {
					// 		openSubmenu(currentItem)
					// 		focusFirstElementOfSiblingMenu(currentItem, event);
					// 	}
					// 	break;
					// }
					case 'ArrowDown': {
						// If top-level item has a submenu, open it; otherwise go to next item.
						if (topLevelItems.includes(currentItem)) {
							focusFirstElementOfSiblingMenu(currentItem, event);
						} else {
							if ('button' === currentItem.localName) {
								moveDownSiblingMenu(currentItem);
							} else {
								moveDownSiblingMenu(currentItem);
								// focusMenuItem(allMenuItems, currentIndex + 1);
							}
						}
						break;
					}
					case 'ArrowUp': {
						// If current item is a button, just go to the previous item.
						if (currentItem.localName === 'button') {
							focusMenuItem(allMenuItems, currentIndex - 1);
						} else {
							const parentLi = currentItem.closest('li');
							if (!parentLi) break;
					
							const parentUl = parentLi.closest('ul');
							if (!parentUl) break;
					
							const directLis = Array.from(parentUl.children).filter(
								(el) => el.tagName.toLowerCase() === 'li'
							);
					
							if (directLis.length && directLis[0] !== parentLi) {
								moveUpSiblingMenu(currentItem);
							} else {
								closeSubmenu(currentItem);
								focusMenuItem(allMenuItems, currentIndex - 1);
							}
						}
						break;
					}
					
					case 'ArrowRight': {
						// Move focus to next item, but enter submenu if available.
						if (topLevelItems.includes(currentItem)) {
							const topIndex = topLevelItems.indexOf(currentItem);
							focusMenuItem(topLevelItems, topIndex + 1);
						} else {
							if ('button' === currentItem.localName) {
								openSubmenu(currentItem);
								focusMenuItem(allMenuItems, currentIndex + 1);
							} else {
								moveDownSiblingMenu(currentItem);
							}
						}
						break;
					}
					case 'ArrowLeft': {
						if (topLevelItems.includes(currentItem)) {
							const topIndex = topLevelItems.indexOf(currentItem);
							focusMenuItem(topLevelItems, topIndex - 1);
						} else {
							// In sub-level => close submenu, move focus up.
							const containerUl = currentItem.closest('ul');
							if (!containerUl) return;
							const directLis = Array.from(containerUl.children).filter(
								(node) => node.tagName.toLowerCase() === 'li'
							);
							if (!directLis.length) return;
							const firstMenuItem = directLis[0].querySelector('a[role="menuitem"]');
							if ('button' === currentItem.localName) {
								focusMenuItem(allMenuItems, currentIndex - 1);
								closeSubmenu(currentItem);
							} else if (currentItem.localName === 'a') {
								if (firstMenuItem === currentItem) {
									closeSubmenu(currentItem, true);
									focusFirstElementOfSiblingMenu(currentItem, event);
								} else {
									moveUpSiblingMenu(currentItem);
								}
							}
						}
						break;
					}
					case 'Home': {
						// Move focus to the first item in the entire menu.
						if (topLevelItems.includes(currentItem)) {
							focusMenuItem(allMenuItems, 0);
						} else {
							focusFirstElementOfMenu(currentItem);
						}
						break;
					}
					case 'End': {
						// Move focus to the last item in the entire menu.
						if (topLevelItems.includes(currentItem)) {
							focusMenuItem(allMenuItems, allMenuItems.length - 1);
						} else {
							focusLastElementOfMenu(currentItem);
						}
						break;
					}
					default: {
						break;
					}
				}
			});
		}
	}, 0);
}

if (document.readyState === 'complete') {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
