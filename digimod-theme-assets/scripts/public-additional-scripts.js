import './public/case-studies';
import './public/common-components';
import './public/communities-of-practice';
import './public/continuous-learning';
import './public/training-cards';
import './public/grid-layout';
import './public/homepage';
import './public/mega-menu';
import './public/navigation';
import './public/search';
import './public/sticky-side-navigation';
import './public/flex-cards';
import './public/dom-overrides';

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
         * Testing for Search – remove once Search is in production
         */

        const siteHeader = document.querySelector('.bcgov-site-header');

        let clickCount = 0;

        function handleHeaderClick() {
            clickCount++;

            if (clickCount === 3) {
                const search = document.querySelector("#search-container");
                if (search) {
                    search.classList.remove('hidden');
                    search.style.display = 'block';
                    clickCount = 0;
                }
            }
        }

        siteHeader.addEventListener('click', handleHeaderClick);

        document.addEventListener('click', function (event) {
            if (!siteHeader.contains(event.target)) {
                const search = document.querySelector("#search-container");
                if (search) {
                    search.classList.add('hidden');
                    search.style.display = 'none';
                    clickCount = 0;
                }
            }
        });


        /**
         * Remove events from WordPress generated links based on 'no-events' class.
         */
        const removeInteractionsLinks = document.querySelectorAll('.no-events a');

        if (removeInteractionsLinks.length) {
            setTimeout(() => {
                removeInteractionsLinks.forEach((link) => {
                    const parent = link.parentNode;
                    const span = document.createElement('span');

                    Array.from(link.attributes).forEach(attr => {
                        // Exclude href attribute
                        if (attr.name.toLowerCase() !== 'href') {
                            span.setAttribute(attr.name, attr.value);
                        }
                    });

                    span.innerHTML = link.innerHTML;
                    span.classList.add('tag');

                    // Check if the new span has a sibling with class .wp-block-post-terms__separator – this is useful for taxonomy categories that have a built in separator.
                    const separatorSibling = link.nextElementSibling;
                    if (link && separatorSibling && separatorSibling.classList.contains('wp-block-post-terms__separator')) {
                        parent.removeChild(separatorSibling);
                    }

                    parent.insertBefore(span, link);
                    parent.removeChild(link);
                });
            }, 0);
        }

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
