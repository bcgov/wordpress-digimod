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
	window.requestAnimationFrame(() => {
		/**
		 * Setup for tabular grid layout modifications for screen reader and mobile.
		 */
		const gridLayouts = document.querySelectorAll('.grid-layout');

		if (null !== gridLayouts) {
			gridLayouts.forEach(function (gridLayout) {

				gridLayout.setAttribute('role', 'table');

				const gridHeader = gridLayout.querySelector('.grid-header');
				const gridBody = gridLayout.querySelector('.grid-body');

				if (gridHeader && gridBody) {

					gridHeader.setAttribute('role', 'row');

					// Create a new div with the role of 'rowgroup'
					const rowGroupDiv = document.createElement('div');
					rowGroupDiv.setAttribute('role', 'rowgroup');

					// Wrap the gridHeader in the new div
					gridLayout.replaceChild(rowGroupDiv, gridHeader);
					rowGroupDiv.appendChild(gridHeader);

					const headerElements = gridHeader.querySelectorAll('.wp-block-heading');

					if (null !== headerElements) {
						headerElements.forEach(function (headerElement) {
							headerElement.setAttribute('role', 'columnheader');
						});
					}

					gridBody.setAttribute('role', 'rowgroup');

					const gridBodyRows = gridBody.querySelectorAll('.wp-block-columns');

					if (gridBodyRows) {
						gridBodyRows.forEach(function (gridBodyRow) {
							gridBodyRow.setAttribute('role', 'row');
						});
					}

					const gridContentCards = gridBody.querySelectorAll('.wp-block-group');

					if (gridContentCards) {
						gridContentCards.forEach(function (flexCard, index) {

							flexCard.setAttribute('role', 'cell');

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
				// First, find the nearest previous sibling that is a .wp-block-heading
				let nearestHeading = null;
				let currentElement = gridLayout.previousElementSibling;

				while (currentElement) {
					if (currentElement.classList.contains('wp-block-heading')) {
						nearestHeading = currentElement;
						break;
					}

					// If no direct sibling .wp-block-heading is found, look inside the last sibling for wp-block-heading thenFind all .wp-block-heading within this sibling
					const headings = currentElement.querySelectorAll('.wp-block-heading');
					if (headings.length > 0) {
						nearestHeading = headings[headings.length - 1]; // Select the last one
						break;
					}
					currentElement = currentElement.previousElementSibling;
				}

				// If a heading is found, set it as the aria-label of gridLayout
				if (nearestHeading) {
					gridLayout.setAttribute('aria-label', nearestHeading.innerText);
				}
			});
		}


		/**
		 * Setup for detail-with-number-container grid layout modifications for screen reader.
		 */

		const detailsWithNumbersContainers = document.querySelectorAll('.detail-with-number-container');

		if (detailsWithNumbersContainers) {

			// Create a new div with the role of 'rowgroup'
			const gridGroupDiv = document.createElement('div');
			gridGroupDiv.setAttribute('role', 'grid');

			// Insert the gridGroupDiv before the first detailContainer
			const firstDetailContainer = detailsWithNumbersContainers[0];
			firstDetailContainer.parentNode.insertBefore(gridGroupDiv, firstDetailContainer);

			// Move each detailContainer inside the gridGroupDiv
			detailsWithNumbersContainers.forEach(function (detailContainer) {
				gridGroupDiv.appendChild(detailContainer);
			});

			detailsWithNumbersContainers.forEach(function (detailContainer, index) {

				detailContainer.setAttribute('role', 'row');

				const headlineCell = detailContainer.querySelector('.wp-block-column:nth-of-type(1)');
				const detailCell = detailContainer.querySelector('.wp-block-column:nth-of-type(2)');

				if (detailCell && headlineCell) {
					detailCell.setAttribute('role', 'gridcell');
					detailCell.setAttribute('aria-label', `Headline: ${headlineCell.innerText}...`);
					detailCell.setAttribute('tabindex', '0');

					const headlines = headlineCell.querySelectorAll('.wp-block-heading');

					headlines.forEach(function (headline) {
						if (headlines) {
							headlines.forEach(function (headline) {
								headline.setAttribute('aria-hidden', true);
							})
						}
					})
				}

				if (0 === index) {

					let nearestHeading = null;
					let currentElement = detailContainer.previousElementSibling;

					// Traverse previous siblings to find the nearest wp-block-heading
					while (currentElement && !nearestHeading) {
						// Check if the current element is a .wp-block-heading
						if (currentElement.classList.contains('wp-block-heading')) {
							nearestHeading = currentElement;
							break;
						}

						// Check inside the current sibling for any wp-block-heading
						const headings = currentElement.querySelectorAll('.wp-block-heading');
						if (headings.length > 0) {
							nearestHeading = headings[headings.length - 1]; // Select the last one found inside the sibling
							break;
						}

						// Move to the previous sibling
						currentElement = currentElement.previousElementSibling;
					}

					// If no heading found, traverse up the DOM and check previous siblings of parent elements
					let parentElement = detailContainer.parentElement;
					while (!nearestHeading && parentElement) {
						currentElement = parentElement.previousElementSibling;

						while (currentElement) {
							if (currentElement.classList.contains('wp-block-heading')) {
								nearestHeading = currentElement;
								break;
							}

							const headings = currentElement.querySelectorAll('.wp-block-heading');
							if (headings.length > 0) {
								nearestHeading = headings[headings.length - 1];
								break;
							}

							currentElement = currentElement.previousElementSibling;
						}

						parentElement = parentElement.parentElement;
					}

					// If a heading is found, set it as the aria-label of gridGroupDiv
					if (nearestHeading) {
						let headingId = nearestHeading.getAttribute('id');
						if (!headingId) {
							headingId = `grid-${Date.now()}`;
							nearestHeading.setAttribute('id', headingId);
						}
						gridGroupDiv.setAttribute('aria-labelledby', headingId);
					}
				}
			});
		}


	});
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}

