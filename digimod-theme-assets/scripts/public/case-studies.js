import { findParentElementByClass, createBreadcrumbs, qs } from '../utils';

/**
 * Case Studies DOM manipulation.
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
		const caseStudyGroup = document.querySelectorAll('.case-study-group');

		if (caseStudyGroup) {
			caseStudyGroup.forEach((group) => {

				const headline = group.querySelector('.wp-block-post-title');
				if (headline) {

					const parentCardContainer = findParentElementByClass(group, 'other-studies');
					const h1Element = document.querySelector('body h1');

					// Remove the current case study from the Other Case Studies list.
					if (parentCardContainer && h1Element) {
						if (headline.innerText === h1Element.innerText) {
							group.parentNode.remove();
						}
					}

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
		 * Case Study Template.
		 * 
		 * Generate the in-page breadcrumbs.
		 */
		const isCaseStudy = document.querySelector('body.single-case-study');

		if (isCaseStudy) {

			// Generate the in-page breadcrumbs.
			const pageTitle = document.title;
			const paths = [
				{ name: "Learn", url: "/learning/" },
				{ name: "Case studies", url: "/learning/case-studies/" },
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