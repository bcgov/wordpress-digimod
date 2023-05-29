/**
 * Continuous learning page DOM manipulation.
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
		 * Aggregation: Card setup – generate links from URL.
		 */
		const isLearningPage = document.querySelector('body.learning');

		if (isLearningPage) {
			// Generate meta field button for getting started links.
			const podcastDiv = document.querySelector('.podcast-button')

			if (podcastDiv) {

				const valueDiv = podcastDiv.querySelector('.value');

				if (valueDiv) {

					podcastDiv.className = 'wp-block-button has-size-regular is-style-underline';

					const linkText = valueDiv.innerText;

					if (linkText) {
						// Create a new anchor element
						const link = document.createElement('a');

						// Set the href, class, tabindex, and label attributes
						link.href = linkText;
						link.className = 'wp-block-button__link wp-element-button';
						link.tabIndex = 0;
						link.innerText = 'Listen now';

						// Replace the value div with the new link
						valueDiv.parentNode.replaceChild(link, valueDiv);
					}
				}
			}
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}