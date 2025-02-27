/**
 * Search DOM.
 */
const digitalGovSearch = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {
	  const searchPage = document.querySelector('body.search');
	  const toggleSearchBtn = document.querySelector('.toggle-search-btn a');
	  const searchFieldContainer = document.querySelector('#search-container');
	  const searchFieldLinks = document.querySelectorAll('#search-container a');
  
	  if (!toggleSearchBtn || !searchFieldContainer) return;
  
	  // Move container before sibling if needed
	  const siblingElement = searchFieldContainer.previousElementSibling;
	  if (siblingElement) {
		siblingElement.parentNode.insertBefore(searchFieldContainer, siblingElement);
	  }
  
	  const searchInput = searchFieldContainer.querySelector('input');
	  const searchSubmitBtn = searchFieldContainer.querySelector('button');
  
	  /**
	   * Helper function: close the search container and return focus
	   */
	  function closeSearchContainer() {
		searchFieldContainer.classList.add('hidden');
		searchFieldContainer.style.display = 'none';
		toggleSearchBtn.classList.remove('close');
		// Give the DOM a frame to settle, then focus the toggle
		requestAnimationFrame(() => {
		  toggleSearchBtn.focus();
		});
	  }
  
	  // Toggle the container when the toggle button is clicked
	  toggleSearchBtn.addEventListener('click', (event) => {
		event.preventDefault();
		// Don’t toggle if on a "search results" page
		if (searchPage) return;
  
		if (searchFieldContainer.classList.contains('hidden')) {
		  // Show container
		  searchFieldContainer.classList.remove('hidden');
		  searchFieldContainer.style.display = 'block';
		  toggleSearchBtn.classList.add('close');
		  if (searchInput) {
			searchInput.focus();
		  }
		} else {
		  // Hide container
		  closeSearchContainer();
		}
	  });
  
	  // Allow keyboard activation (Enter/Space) on toggle button
	  toggleSearchBtn.addEventListener('keydown', (event) => {
		if (event.code === 'Space' || event.code === 'Enter') {
		  event.preventDefault();
		  toggleSearchBtn.click();
		}
	  });
  
	  /**
	   * Hide container on outside click
	   */
	  document.addEventListener('mousedown', (event) => {
		const isContainerOpen = !searchFieldContainer.classList.contains('hidden');
		if (!isContainerOpen) return;
  
		const clickInsideContainer = searchFieldContainer.contains(event.target);
		const clickOnToggle = toggleSearchBtn.contains(event.target);
		const clickOnBtn = searchSubmitBtn && searchSubmitBtn.contains(event.target);
		const clickOnLink = searchFieldLinks && [...searchFieldLinks].some(link => link.contains(event.target) || searchFieldLinks.forEach((link) => link.contains(event.target)));
  
		// If user clicks the actual submit button, do that action
		if (clickOnBtn) {
		  event.preventDefault();
		  searchSubmitBtn.click();
		  return;
		}
  
		// Otherwise, close if outside both container and toggle
		if (!clickInsideContainer && !clickOnToggle && !clickOnLink) {
			// Delay closing just a bit so Safari can finish the link click
			setTimeout(() => {
			  closeSearchContainer();
			}, 300);
		  }		  
	  });
  
	  /**
	   * Hide container on outside focus (handles tabbing away)
	   */
	  document.addEventListener('focusin', (event) => {
		const isContainerOpen = !searchFieldContainer.classList.contains('hidden');
		if (!isContainerOpen) return;
  
		const focusedInsideContainer = searchFieldContainer.contains(event.target);
		const focusedOnToggle = toggleSearchBtn.contains(event.target);
  
		if (!focusedInsideContainer && !focusedOnToggle) {
			setTimeout(() => {
				closeSearchContainer();
			}, 300);
		}
	  });
  
	  /**
	   * Hide container on ESC key
	   */
	  document.addEventListener('keydown', (event) => {
		const isContainerOpen = !searchFieldContainer.classList.contains('hidden');
		if (!isContainerOpen) return;
  
		if (event.key === 'Escape') {
		  event.preventDefault();
		  closeSearchContainer();
		}
	  });
  
	  // Position container and handle search results page
	  window.requestAnimationFrame(() => {
		const header = document.querySelector('.bcgov-header-group');
		if (header) {
		  const headerHeight = window.getComputedStyle(header).getPropertyValue('height');
		  searchFieldContainer.style.top = headerHeight;
		}
		// Hidden by default
		searchFieldContainer.style.display = 'none';
  
		// If on a search results page, remove container entirely
		if (searchPage) {
		  searchFieldContainer.remove();
		  toggleSearchBtn.classList.add('disabled');
		  // disallow keyboard nav on search results pages
		  toggleSearchBtn.setAttribute('tabindex', '-1');
		}
	  });
	});
  };
  
  if (document.readyState === 'complete') {
	digitalGovSearch();
  } else {
	document.addEventListener('DOMContentLoaded', digitalGovSearch);
  }
  