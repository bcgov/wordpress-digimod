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
		 * See: https://www.w3.org/WAI/ARIA/apg/patterns/table/
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
							if (headerElement) {
								const headerValue = headerElement.innerText;
								const headerTagName = headerElement.tagName.toLowerCase();

								const newElement = document.createElement(headerTagName);
								headerValue ? newElement.innerText = headerValue : newElement.innerText = "";
								newElement.classList.add('wp-block-heading', 'mobile-only');
								flexCard.insertBefore(newElement, flexCard.firstChild);
							}
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
				if (nearestHeading && nearestHeading.innerText) {
					gridLayout.setAttribute('aria-label', nearestHeading.innerText);
				}
			});
		}


		/**
		 * Setup for detail-with-number-container grid layout modifications for screen reader.
		 * See: https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/layout-grids/
		 */
		const detailsWithNumbersContainers = document.querySelectorAll('.detail-with-number-container');

		if (detailsWithNumbersContainers.length > 0) {

			// Create a new div with the role of 'grid'
			const gridGroupDiv = document.createElement('div');
			gridGroupDiv.setAttribute('role', 'grid');
			gridGroupDiv.setAttribute('data-wrap-cols', true);
			gridGroupDiv.setAttribute('data-wrap-rows', true);

			// Insert the gridGroupDiv before the first detailContainer
			const firstDetailContainer = detailsWithNumbersContainers[0];
			firstDetailContainer.parentNode.insertBefore(gridGroupDiv, firstDetailContainer);

			// Move each detailContainer inside the gridGroupDiv
			detailsWithNumbersContainers.forEach(function (detailContainer) {
				gridGroupDiv.appendChild(detailContainer);
			});

			let determinedHeadingLevel = null; // This will store the heading level to be used across all rows

			detailsWithNumbersContainers.forEach(function (detailContainer, index) {

				detailContainer.setAttribute('role', 'row');

				const headlineCell = detailContainer.querySelector('.wp-block-column:nth-of-type(1)');
				const detailCell = detailContainer.querySelector('.wp-block-column:nth-of-type(2)');

				if (detailCell && headlineCell) {
					detailCell.setAttribute('role', 'gridcell');
					detailCell.setAttribute('tabindex', '0');

					const headlines = headlineCell.querySelectorAll('.wp-block-heading');

					// Concatenate all headlines' text into a single string
					let concatenatedHeadlineText = '';
					headlines.forEach(function (headline) {
						concatenatedHeadlineText += headline.innerText + ' ';
						headline.setAttribute('aria-hidden', true); // Hide original headlines from screen readers
					});

					if (concatenatedHeadlineText.trim()) {
						if (index === 0) {
							// Determine heading level on the first row
							let nearestHeading = null;
							let currentElement = detailContainer.previousElementSibling;

							// Traverse previous siblings to find the nearest wp-block-heading
							while (currentElement && !nearestHeading) {
								if (currentElement.classList.contains('wp-block-heading')) {
									nearestHeading = currentElement;
									break;
								}

								const headings = currentElement.querySelectorAll('.wp-block-heading');
								if (headings.length > 0) {
									nearestHeading = headings[headings.length - 1]; // Select the last one found inside the sibling
									break;
								}

								currentElement = currentElement.previousElementSibling;
							}

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

							if (nearestHeading) {
								const nearestHeadingTagName = nearestHeading.tagName.toLowerCase();
								determinedHeadingLevel = parseInt(nearestHeadingTagName.replace('h', '')) + 1;
								if (determinedHeadingLevel > 6) determinedHeadingLevel = 6; // <h6> is the lowest level
							} else {
								determinedHeadingLevel = 2; // Default to <h2> if no heading is found
							}
						}

						// Create the new heading element using the determined heading level
						const newHeading = document.createElement(`h${determinedHeadingLevel}`);
						newHeading.innerText = concatenatedHeadlineText.trim();
						newHeading.classList.add('sr-only');

						// Insert the new heading at the start of detailCell
						detailCell.insertBefore(newHeading, detailCell.firstChild);
					}
				}

				if (index === 0) {
					let nearestHeading = null;
					let currentElement = detailContainer.previousElementSibling;

					while (currentElement && !nearestHeading) {
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

			// Add keyboard navigation
			gridGroupDiv.addEventListener('keydown', function (event) {
				const activeElement = document.activeElement;
				if (activeElement.getAttribute('role') === 'gridcell') {
					const row = activeElement.parentElement;
					const rows = Array.from(gridGroupDiv.querySelectorAll('[role="row"]'));
					const cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
					const rowIndex = rows.indexOf(row);
					const cellIndex = cells.indexOf(activeElement);

					switch (event.key) {
						case 'ArrowRight':
						case 'ArrowDown':
							if (rowIndex < rows.length - 1) {
								const nextRowCells = rows[rowIndex + 1].querySelectorAll('[role="gridcell"]');
								nextRowCells[cellIndex].focus();
							}
							break;
						case 'ArrowLeft':
						case 'ArrowUp':
							if (rowIndex > 0) {
								const prevRowCells = rows[rowIndex - 1].querySelectorAll('[role="gridcell"]');
								prevRowCells[cellIndex].focus();
							}
							break;
						case 'PageDown':
							if (rowIndex < rows.length - 1) {
								const nextRowIndex = Math.min(rowIndex + 3, rows.length - 1); // Adjust 3 as the number of rows to scroll
								const nextRowCells = rows[nextRowIndex].querySelectorAll('[role="gridcell"]');
								nextRowCells[cellIndex].focus();
							}
							event.preventDefault();
							break;
						case 'PageUp':
							if (rowIndex > 0) {
								const prevRowIndex = Math.max(rowIndex - 3, 0); // Adjust 3 as the number of rows to scroll
								const prevRowCells = rows[prevRowIndex].querySelectorAll('[role="gridcell"]');
								prevRowCells[cellIndex].focus();
							}
							event.preventDefault();
							break;
						case 'Home':
							// Move focus to the first cell in the first row
							rows[0].querySelector('[role="gridcell"]').focus();
							event.preventDefault();
							break;

						case 'End':
							// Move focus to the last cell in the last row
							const lastRow = rows[rows.length - 1];
							lastRow.querySelector('[role="gridcell"]:last-child').focus();
							event.preventDefault();
							break;
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

