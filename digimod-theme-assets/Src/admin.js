
import '../blocks/search-results/index.js';



const domReady = () => {
	// Search for and disabled the SearchWP quoted searches toggle. It causes some issue with metrics link tracking leading to a timeout when following links.
	//	Quoted search will continue to work even if turned off.
	const isSearchWPSettings = document.querySelector('body.searchwp_page_searchwp-settings');
	if(isSearchWPSettings){
		const quotedSearchesToggle = document.querySelector('#swp-quoted_search_support');
		if(quotedSearchesToggle){
			quotedSearchesToggle.setAttribute('disabled','disabled');

			let tmpWarning = document.createElement('p');
			tmpWarning.style.fontWeight = 'bold';
			tmpWarning.textContent = 'On the DigitalGov Website this must remain off to prevent issues with metrics tracking. Quoted searches will still work even with this disabled.';
			
			quotedSearchesToggle.parentNode.parentNode.appendChild(tmpWarning);
		}
	}
	
}


if ('complete' === document.readyState) {
    domReady();
} else {
    document.addEventListener('DOMContentLoaded', domReady);
}