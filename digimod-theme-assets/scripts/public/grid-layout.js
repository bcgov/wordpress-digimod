/**
 * Grid layout DOM manipulation.
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
		 * Headline setup for grid layout to mobile.
		 */
		const gridLayouts = document.querySelectorAll('.grid-layout');

		if (null !== gridLayouts) {
			gridLayouts.forEach(function (gridLayout) {
				const gridHeader = gridLayout.querySelector('.grid-header');
	
				if (gridHeader) {
					const headerElements = gridHeader.querySelectorAll('.wp-block-heading');
	
					const flexCards = gridLayout.querySelectorAll('.wp-block-group.flex-card');
	
					if (flexCards) {
						flexCards.forEach(function (flexCard, index) {
							const headerIndex = index % headerElements.length;
							const headerElement = headerElements[headerIndex];
							const headerValue = headerElement.innerText;
							const headerTagName = headerElement.tagName.toLowerCase();
		
		
							const newElement = document.createElement(headerTagName);
							newElement.innerText = headerValue;
							newElement.classList.add('wp-block-heading', 'mobile-only');
		
							flexCard.insertBefore(newElement, flexCard.firstChild);
						});
					}
				}
			});
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}

