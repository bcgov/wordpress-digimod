/**
 * Navigation DOM manipulation for Mega Menu display characteristics.
 */
const domMenuReady = () => {
	// Element references
	const header = document.querySelector('header.header-container');
	const nav = header;
	let lastScrollTop = 0;
	const scrollTopPadding = 0;
	const searchFieldContainer = document.querySelector('.search-field-container');

	// Throttle helper
	const throttle = (fn, limit = 100) => {
		let lastCall = 0;
		return (...args) => {
			const now = Date.now();
			if (now - lastCall >= limit) {
				lastCall = now;
				fn(...args);
			}
		};
	};

	// Inject required styles
	const style = document.createElement('style');
	style.textContent = `
		header.header-container {
			transition: transform 0.3s ease, opacity 0.3s ease;
			will-change: transform, opacity;
		}
	`;
	document.head.appendChild(style);

	// Scroll logic
	const windowScroll = () => {
		const backToTop = document.querySelector('.back-to-top');
		if (backToTop) {
			const nearBottom = window.pageYOffset + window.innerHeight > document.body.offsetHeight - 1000;
			backToTop.style.display = nearBottom ? 'block' : 'none';
			backToTop.style.opacity = nearBottom ? '0.75' : '0';
		}

		const scrollTopPosition = window.pageYOffset || document.documentElement.scrollTop;
		const shouldEnable = window.innerWidth >= 1360;
		if (nav) {
			if (scrollTopPosition < lastScrollTop && shouldEnable) {
				if (scrollTopPosition > scrollTopPadding) {
					header.style.transform = 'translateY(0%)';
					header.style.opacity = '1';
					if (searchFieldContainer) {
						searchFieldContainer.style.transform = 'translateY(0%)';
						searchFieldContainer.style.opacity = '1';
					}
				}
			} else if (scrollTopPosition > scrollTopPadding && shouldEnable) {
				header.style.transform = 'translateY(-100%)';
				header.style.opacity = '0';
				if (searchFieldContainer) {
					searchFieldContainer.style.transform = 'translateY(-100%)';
					searchFieldContainer.style.opacity = '0';
				}
			}

			lastScrollTop = Math.max(0, scrollTopPosition);
		}
	};
	document.addEventListener('scroll', throttle(windowScroll, 100), { passive: true });

	// Primary menu
	const handlePrimaryPointerEnter = (item) => {
		const subMenuContainer = item.querySelector('.wp-block-navigation__submenu-container');
		const popularContentShowing = document.querySelector('.live-search-extra');

		if (subMenuContainer && !popularContentShowing) {
			subMenuContainer.style.display = 'block';

			const firstSubMenuItemButton = subMenuContainer.querySelector('.wp-block-navigation-item:first-child button');
			if (firstSubMenuItemButton && firstSubMenuItemButton.getAttribute('aria-expanded') === 'false') {
				firstSubMenuItemButton.focus();
				firstSubMenuItemButton.click();
				firstSubMenuItemButton.blur();
			}
		}

		const itemMenuSubUL = item.querySelector('.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');
		if (itemMenuSubUL && !itemMenuSubUL.dataset.checkedForHeight) {
			const parentULContainer = itemMenuSubUL.parentNode.parentNode;
			if (parentULContainer.clientHeight <= itemMenuSubUL.clientHeight) {
				parentULContainer.style.height = `${itemMenuSubUL.clientHeight}px`;
			}
			itemMenuSubUL.dataset.checkedForHeight = 'true';
		}
	};

	const handlePrimaryPointerLeave = (item) => {
		const subMenuContainer = item.querySelector('.wp-block-navigation__submenu-container');
		if (!subMenuContainer) return;

		const firstSubMenuItemButton = subMenuContainer.querySelector('.wp-block-navigation-item:first-child button');
		if (firstSubMenuItemButton) {
			firstSubMenuItemButton.setAttribute('aria-expanded', 'false');
		}
	};

	const initializePrimaryMenuItems = () => {
		const items = document.querySelectorAll(
			'header nav > .wp-block-navigation__container > .wp-block-navigation-item.has-child'
		);
		items.forEach((item) => {
			item.addEventListener('pointerenter', () => handlePrimaryPointerEnter(item));
			item.addEventListener('pointerleave', () => handlePrimaryPointerLeave(item));
		});
	};

	// Secondary menu
	const handleSecondaryPointerEnter = (parentLI) => {
		const subUL = parentLI.querySelector('.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');
		if (!subUL) return;

		subUL.style.width = '66vw';

		const container = subUL.parentNode.parentNode;
		if (!subUL.dataset.checkedForHeight) {
			if (container.clientHeight <= subUL.clientHeight) {
				container.style.height = `${subUL.clientHeight}px`;
				subUL.style.height = 'calc(100% - 3rem)';
			} else {
				subUL.style.height = '100%';
			}
			subUL.dataset.checkedForHeight = 'true';
		}
	};

	const initializeSecondaryMenuItems = () => {
		const items = document.querySelectorAll('.wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');
		items.forEach((menuItem) => {
			const parentLI = menuItem.closest('li');
			const link = parentLI.querySelector('a');
			if (!link) return;

			const headline = document.createElement('li');
			headline.classList.add('headline');
			const headlineLink = document.createElement('a');
			headlineLink.href = link.href;
			headlineLink.textContent = link.textContent;
			headline.appendChild(headlineLink);
			menuItem.prepend(headline);
			menuItem.style.width = '66vw';

			parentLI.addEventListener('pointerenter', () => handleSecondaryPointerEnter(parentLI));
		});
	};

	// Secondary-level plain links
	const handleSecondaryLinkPointer = (link) => {
		link.addEventListener('pointerenter', (e) => {
			const container = e.target.closest('ul');
			const topItem = container?.querySelector('li');
			const topSubmenu = topItem?.querySelector('ul');
			if (topSubmenu) topSubmenu.style.display = 'none';
		});

		link.addEventListener('pointerleave', (e) => {
			const container = e.target.closest('ul');
			const topItem = container?.querySelector('li');
			const topSubmenu = topItem?.querySelector('ul');
			if (topSubmenu) topSubmenu.style.display = 'block';
		});
	};

	const initializeSecondaryLevelLinks = () => {
		setTimeout(() => {
			const links = document.querySelectorAll(
				'header nav.wp-block-navigation > ul.wp-block-navigation__container > li > ul.wp-block-navigation__submenu-container > li.wp-block-navigation-link > a.wp-block-navigation-item__content'
			);
			links.forEach((link) => {
				link.classList.add('no-sub-menu');
				handleSecondaryLinkPointer(link);
			});
		}, 50);
	};

	// Initialize all
	// initializePrimaryMenuItems();
	// initializeSecondaryMenuItems();
	// initializeSecondaryLevelLinks();
};

// Fire on DOM ready
if (document.readyState === 'complete') {
	domMenuReady();
} else {
	document.addEventListener('DOMContentLoaded', domMenuReady);
}
