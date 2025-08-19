/**
 * DOM manipulation for hide/show of header.
 */
const domHeaderReady = () => {
	/**
	 * Manage events after page scroll, debounced.
	 */
	let lastScrollTop = 0;
	const scrollTopPadding = 100;
	const header = document.querySelector('header');
	const nav = document.querySelector('nav');
	const searchFieldContainer = document.querySelector('#search-field-container');

	/**
	 * Show the header (scroll up)
	 */
	const showHeader = () => {
		header.style.opacity = '1';
		header.style.transform = 'translateY(0%)';

		if (searchFieldContainer) {
			searchFieldContainer.style.opacity = '1';
			searchFieldContainer.style.transform = 'translateY(0%)';
		}
	};

	/**
	 * Hide the header (scroll down)
	 */
	const hideHeader = () => {
		header.style.opacity = '0';
		header.style.transform = 'translateY(-100%)';

		if (searchFieldContainer) {
			searchFieldContainer.style.opacity = '0';
			searchFieldContainer.style.transform = 'translateY(-100%)';
		}
	};

	/**
	 * Debounce helper
	 */
	const debounce = (func, wait = 75) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	// Debounced upward scroll logic
	const debouncedShowHeader = debounce(showHeader, 50);

	/**
	 * Scroll handler: immediate down, debounced up
	 */
	const handleScroll = () => {
		if (!nav || !header) return;

		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const scrollingUp = scrollTop < lastScrollTop;
		const pastThreshold = scrollTop > scrollTopPadding;

		if (scrollingUp && pastThreshold) {
			debouncedShowHeader(); // Delayed show
		} else if (!scrollingUp && pastThreshold) {
			hideHeader(); // Immediate hide
		}

		lastScrollTop = Math.max(scrollTop, 0);
	};

	document.addEventListener('scroll', handleScroll);

};

// Fire on DOM ready
if (document.readyState === 'complete') {
	domHeaderReady();
} else {
	document.addEventListener('DOMContentLoaded', domHeaderReady);
}