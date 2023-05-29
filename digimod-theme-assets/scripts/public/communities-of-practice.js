import { createBreadcrumbs, qs } from '../utils';

/**
 * Community of Practice DOM manipulation.
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
		const copGroup = document.querySelectorAll('.cop-group');

		if (copGroup) {
			copGroup.forEach((group) => {

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
		 * Community of Practice Template.
		 * 
		 * Generate the in-page breadcrumbs.
		 * Generate meta field links for CoP manager email links.
		 * Generate meta field links for CoP social links.
		 */
		const isCommunityOfPractice = document.querySelector('body.single-cop');

		if (isCommunityOfPractice) {

			// Links for CoP manager email.
			const copNames = document.querySelectorAll('.cop-name');

			if (copNames) {
				copNames.forEach(copName => {
					const emailBlock = copName.nextElementSibling;
					if (emailBlock && emailBlock.classList.contains('cop-email')) {
						const email = emailBlock.querySelector('.value').textContent.replace('mailto:', '');
						const name = copName.querySelector('.value').textContent;
						if (email && name) {
							const link = document.createElement('a');
							link.href = `mailto:${email}`;
							link.textContent = name;
							copName.querySelector('.value').innerHTML = '';
							copName.querySelector('.value').appendChild(link);
						}
						emailBlock.remove();
					}
				});
			}

			// Clean up errant CoP email links.
			const copEmail = document.querySelectorAll('.cop-email');

			if (copEmail) {
				copEmail.forEach(email => {
					email.remove();
				});
			}

			// Wiring up for CoP social links.
			const copSocialLinks = document.querySelectorAll('.cop-social-link');

			if (copSocialLinks) {
				copSocialLinks.forEach((link) => {
					const linkUrl = link.querySelector('.value').textContent;
					if (linkUrl && linkUrl !== '') {
						// Create a new link element
						const newLink = document.createElement('a');

						// Set the "href" attribute of the new link to the extracted URL
						if (newLink) {
							newLink.href = linkUrl;
							newLink.textContent = '';
							if (link.classList.contains('msteams-link')) {
								newLink.textContent = 'MS Teams';
							}
							if (link.classList.contains('rocketchat-link')) {
								newLink.textContent = 'RocketChat';
							}
							if (link.classList.contains('yammer-link')) {
								newLink.textContent = 'Yammer';
							}
							if (link.classList.contains('website-link')) {
								newLink.textContent = 'Website';
							}
						}

						// Append the new link to the document body (or any other element)
						link.appendChild(newLink);
						link.querySelector('.value').remove();
					}
				});
			}

			if (0 === copSocialLinks.length) {
				const linkGroup = document.querySelector('.cop-social-links-group');
				if (linkGroup) linkGroup.remove();
			}

			// Generate the in-page breadcrumbs.
			const pageTitle = document.title;
			const paths = [
				{ name: "Communities", url: "/communities/" },
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