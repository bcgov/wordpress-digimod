/**
 * Training page DOM manipulation.
 *
 * Note: as this runs on all pages be sure to null check all elements before use.
 *
 * @return {void}
 */
const bcgovDigiModPlugin = {
    initTrainingPage: function () {
    /*
     * SafarIE bug requires 0ms timeout.
     */
        requestAnimationFrame(() => {
            /**
             * Aggregation: Card setup – generate links from URL.
             */

            const isTrainingPage = document.querySelector('body.training');

            if (isTrainingPage) {

                const cardContainers = document.querySelectorAll('.card-container .flex-card');
    
                if (cardContainers) {
                    cardContainers.forEach((cardContainer) => {
                        const cardDiv = cardContainer.querySelector('.card-link');
    
                        if (cardDiv) {
                            const valueDiv = cardDiv.querySelector('.value');
    
                            if (valueDiv) {
                                const linkText = valueDiv.innerText;
    
                                if (linkText) {
                                    // Create a new anchor element
                                    const link = document.createElement('a');
    
                                    // Set the href, class, tabindex, and label attributes
                                    link.href = linkText;
                                    link.className = 'card-title-link';
                                    link.tabIndex = 0;
    
                                    // Wrap the cardContainer with the link
                                    cardContainer.parentNode.insertBefore(link, cardContainer);
                                    link.appendChild(cardContainer);
    
                                    // Convert links in .taxonomy-training_categories to spans with the 'tag' class
                                    const taxonomyTags = cardContainer.querySelectorAll('.taxonomy-training_categories a');
                                    taxonomyTags.forEach((taxonomyTag) => {
                                        const spanTag = document.createElement('span');
                                        spanTag.className = 'training-card-tags';
                                        spanTag.textContent = taxonomyTag.textContent;
                                        taxonomyTag.parentNode.replaceChild(spanTag, taxonomyTag);
                                    });

                                    const commaSeparators =  cardContainer.querySelectorAll('.wp-block-post-terms__separator');

                                    if (commaSeparators) {
                                        commaSeparators.forEach( (comma) => {
                                            comma.remove();
                                        })
                                    }
    
                                    // Remove the .value div and cardDiv
                                    valueDiv.parentNode.removeChild(valueDiv);
                                    cardDiv.remove();
                                }
                            }
                        }
                    });
                }
            }

        });
    }
}

if ('complete' === document.readyState) {
	bcgovDigiModPlugin.initTrainingPage();
} else {
	document.addEventListener('DOMContentLoaded', bcgovDigiModPlugin.initTrainingPage());
}
