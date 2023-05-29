import './public/case-studies';
import './public/common-components';
import './public/communities-of-practice';
import './public/continuous-learning';
import './public/flex-cards';
import './public/homepage';
import './public/navigation';
import './public/sticky-side-navigation';

/**
 * All pages DOM manipulation.
 * This script also imports all others for build step.
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
		 * Link checking for external URLs and classing accordingly.
		 */
		// const pageLinks = document.querySelectorAll('.bcgov-body-content a');

		// if (pageLinks) {
		// 	pageLinks.forEach((link) => {
		// 		let isInternal = (link.href.indexOf(window.site.domain) && link.href.indexOf('mailto')) ? true : false;

		// 		if (isInternal) {
		// 			link.classList.add('external');
		// 		}
		// 	})
		// }

		/**
		 * Add data-link attribute to all in-page links in order to do the bold hover state.
		 * Keeps link from reflowing width.
		 */
		setTimeout(function () {
			const pageLinks = document.querySelectorAll('.bcgov-body-content a');

			if (pageLinks) {
				pageLinks.forEach((link) => {
					link.setAttribute('data-text', link.innerText);
				})
			}
		}, 50);

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}