import { createBreadcrumbs, qs } from '../utils';

/**
 * Common Components DOM manipulation.
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
		 * Aggregation: Card setup.
		 */
		const commonComponentGroup = document.querySelectorAll('.common-component-group');

		if (commonComponentGroup) {
			commonComponentGroup.forEach((group) => {

				const categoryElement = group.querySelector('.taxonomy-common_component_category');

				if (categoryElement) {
					const separators = categoryElement.querySelectorAll('.wp-block-post-terms__separator');
					if (separators) {
						separators.forEach(separator => separator.remove());
					}
					const tags = categoryElement.querySelectorAll('a[rel="tag"]');
					if (tags) {
						tags.forEach(tag => {
							const span = document.createElement('span');

							span.textContent = tag.textContent;
							span.classList.add('tag');
							if ('Active' === tag.textContent) {
								tag.remove();
							} else {
								tag.replaceWith(span);
							}

						});
					}
				}

				const headline = group.querySelector('.wp-block-post-title');
				if (headline) {
					const headlineLink = headline.querySelector('a');
					if (headlineLink) {
						const link = headlineLink.getAttribute('href');
						const linkWrapper = document.createElement('a');
						linkWrapper.href = link;
						group.parentNode.insertBefore(linkWrapper, group);
						linkWrapper.appendChild(group);
						headline.replaceChild(headlineLink.firstChild, headlineLink);
					}
				}

			});
		}

		/**
		 * Common Components Template.
		 * 
		 * Generate the in-page breadcrumbs.
		 * Modify category tag output to remove links and 'active'.
		 * Generate meta field button for getting started links.
		 */
		const isCommonComponent = document.querySelector('body.single-common-component');

		if (isCommonComponent) {

			// Modify category tag output.
			const categoryElement = document.querySelector('.taxonomy-common_component_category');
			const separators = categoryElement.querySelectorAll('.wp-block-post-terms__separator');
			if (separators) {
				separators.forEach(separator => separator.remove());
			}
			const tags = categoryElement.querySelectorAll('a[rel="tag"]');
			if (tags) {
				tags.forEach(tag => {
					const span = document.createElement('span');

					span.textContent = tag.textContent;
					span.classList.add('tag');
					if ('Active' === tag.textContent) {
						tag.remove();
					} else {
						tag.replaceWith(span);
					}

				});
			}

			// Generate meta field button for getting started links.
			const gettingStartedDiv = document.querySelector('.getting-started-button')

			if (gettingStartedDiv) {

				const valueDiv = gettingStartedDiv.querySelector('.value');

				if (valueDiv) {

					gettingStartedDiv.className = 'wp-block-button has-size-regular is-style-default';

					const linkText = valueDiv.innerText;

					if (linkText) {
						// Create a new anchor element
						const link = document.createElement('a');

						// Set the href, class, tabindex, and label attributes
						link.href = linkText;
						link.className = 'wp-block-button__link wp-element-button';
						link.tabIndex = 0;
						link.innerText = 'Start using now';

						// Replace the value div with the new link
						valueDiv.parentNode.replaceChild(link, valueDiv);
					}
				}
			}

			// Generate the in-page breadcrumbs.
			const pageTitle = document.title;
			const paths = [
				{ name: "Common components", url: "/common-components/" },
				{ name: pageTitle }
			];
		  
			const breadcrumbs = createBreadcrumbs(paths);
			const breadcrumbsContainer = qs('.breadcrumb-placeholder');
			if(breadcrumbsContainer) {
				breadcrumbsContainer.appendChild(breadcrumbs);
			}
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}