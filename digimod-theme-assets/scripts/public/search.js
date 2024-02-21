import { addSafeEventListenerPlugin } from '../utils';
/**
 * Search DOM.
 */
const digitalGovSearch = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {

		const toggleSearchBtn = document.querySelector('.toggle-search-btn a');
		const searchFieldContainer = document.querySelector('#search-container');

		if (toggleSearchBtn) {
			if (searchFieldContainer) {
				const siblingElement =
					searchFieldContainer.previousElementSibling;

				const searchInput = searchFieldContainer.querySelector('input');
				const searchButton = searchFieldContainer.querySelector('button');

				if (searchFieldContainer && siblingElement) {
					siblingElement.parentNode.insertBefore(
						searchFieldContainer,
						siblingElement
					);
				}
				addSafeEventListenerPlugin(toggleSearchBtn, 'click', function (event) {
					event.preventDefault();

					if (searchFieldContainer) {
						if (
							searchFieldContainer.classList.contains('hidden')
						) {
							searchFieldContainer.classList.remove('hidden');
							searchFieldContainer.style.display = 'block';
							if (searchInput) {
								searchInput.focus();
							}
						} else {
							searchFieldContainer.classList.add('hidden');
							searchFieldContainer.style.display = 'none';
						}
					}
				});

				addSafeEventListenerPlugin(toggleSearchBtn, 'keydown', (event) => {
					if (event.code === 'Space' || event.code === 'Enter') {
						event.preventDefault();
						toggleSearchBtn.click();
					}
				});

				// Add event listener for the escape key
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape' && !searchFieldContainer.classList.contains('hidden')) {
						event.preventDefault();
						toggleSearchBtn.click();
					}
				});

				if (searchFieldContainer) {

					
					addSafeEventListenerPlugin(searchButton, 'blur', function (event) {
						event.preventDefault();
						const resultsShowing = document.querySelector('.searchwp-live-search-results-showing');

							window.requestAnimationFrame(() => {
								if (
									searchInput ===
									event.target.ownerDocument.activeElement
								)
									return;
								if (
									toggleSearchBtn ===
									event.target.ownerDocument.activeElement
								)
									return;
								if (resultsShowing) return;
								
								toggleSearchBtn.focus();
								toggleSearchBtn.click();
							});
					});
				}
			}
		}
		window.requestAnimationFrame(() => {
			const searchPage = document.querySelector('body.search');
			const header = document.querySelector('.bcgov-header-group');
			const headerHeight = window
				.getComputedStyle(header)
				.getPropertyValue('height');
			if (searchFieldContainer) {
				searchFieldContainer.style.top = headerHeight;
				searchFieldContainer.style.display = 'none';
			}

			if (searchPage && toggleSearchBtn) {
				toggleSearchBtn.click();
			}

		});
	});
};

if ('complete' === document.readyState) {
	digitalGovSearch();
} else {
	addSafeEventListenerPlugin(
		document,
		'DOMContentLoaded',
		digitalGovSearch
	);
}
