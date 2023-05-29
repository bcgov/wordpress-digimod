/**
 * Homepage DOM manipulation.
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
		 * Breadcrumb removal.
		 * Card setup.
		 */
		const isHome = document.querySelector('body.home');

		if (isHome) {
			const breadcrumbs = document.querySelector('.breadcrumb-navigation-container');

			if (breadcrumbs) {
				breadcrumbs.remove();
			}

			const getStartedGroup = document.querySelectorAll('.get-started-group');

			if (getStartedGroup) {
				getStartedGroup.forEach((group) => {

					const headline = group.querySelector('h3');
					const headlineLink = headline.querySelector('a');
					const linkSpan = group.querySelector('.link-label .value');

					if (headlineLink && linkSpan) {
						const link = headlineLink.getAttribute('href');
						linkSpan.innerHTML = `<a href="${link}" class="wp-block-button__link has-secondary-brand-color has-text-color wp-element-button">${linkSpan.innerHTML}</a>`;
						linkSpan.classList.remove('value');
						linkSpan.classList.add('wp-block-button', 'has-size-regular', 'is-style-underline');
						while (linkSpan.parentNode.classList.length > 0) {
							linkSpan.parentNode.classList.remove(linkSpan.parentNode.classList.item(0));
						}
						linkSpan.parentNode.classList.add('wp-block-buttons');
						headline.replaceChild(headlineLink.firstChild, headlineLink);
					}
				});
			}
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}