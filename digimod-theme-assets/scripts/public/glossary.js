/**
 * General Digimod Definitions glossary filter.
 */
export const digmodPluginGlossary = () => {
	/*
	 * SafarIE iOS requires window.requestAnimationFrame update.
	 */
	window.requestAnimationFrame(() => {
		if (!document.body.classList.contains('glossary')) {
			return;
		}

		const categoryLinkSelector =
			'.wp-block-categories-list a[data-text]';

		const updateGlossaryTags = () => {
			const tagLinks = document.querySelectorAll(
				'.glossary-tag a[data-text]'
			);
			tagLinks.forEach((link) => {
					link.setAttribute(
						'aria-disabled',
						'true'
					);
					link.setAttribute(
						'tabindex',
						'-1'
					);
			});
		}

		const updateGlossaryNavigation = () => {
			const navLinks = document.querySelectorAll(
				'#glossary-nav a[href^="#glossary-"]'
			);

			navLinks.forEach((link) => {
				const targetId = link
					.getAttribute('href')
					?.substring(1);

				const target = targetId
					? document.getElementById(targetId)
					: null;

				const group = target?.closest(
					'.glossary-entry-group'
				);

				const isVisible =
					group &&
					getComputedStyle(group).display !== 'none';

				/*
				 * Preserve the link's original tabindex so it can be
				 * restored when the letter becomes available again.
				 */
				if (!link.hasAttribute('data-original-tabindex')) {
					const originalTabindex =
						link.getAttribute('tabindex');

					link.dataset.originalTabindex =
						null === originalTabindex
							? '__none__'
							: originalTabindex;
				}

				link.classList.toggle(
					'is-disabled',
					!isVisible
				);

				if (!isVisible) {
					link.setAttribute(
						'aria-disabled',
						'true'
					);
					link.setAttribute('tabindex', '-1');
				} else {
					link.removeAttribute('aria-disabled');

					if (
						'__none__' ===
						link.dataset.originalTabindex
					) {
						link.removeAttribute('tabindex');
					} else {
						link.setAttribute(
							'tabindex',
							link.dataset.originalTabindex
						);
					}
				}
			});
		};

		/**
		 * Show every glossary definition and letter group.
		 */
		const showAllGlossaryItems = () => {
			document
				.querySelectorAll(
					'.definitions.type-definitions'
				)
				.forEach((definition) => {
					definition.style.display = 'block';
				});

			document
				.querySelectorAll('.glossary-entry-group')
				.forEach((group) => {
					group.style.display = 'block';

					const firstDefinition = group.querySelector(
						':scope > .glossary-entry-flex > .glossary-entry'
					);

					if (firstDefinition) {
						firstDefinition.style.display =
							'block';
					}
				});
		};

		/**
		 * Apply the active class to the selected category link.
		 * @param selectedLink
		 */
		const setActiveCategory = (selectedLink = null) => {
			document
				.querySelectorAll(categoryLinkSelector)
				.forEach((categoryLink) => {
					categoryLink.classList.toggle(
						'active',
						categoryLink === selectedLink
					);
				});
		};

		/**
		 * Reset all glossary filtering.
		 */
		const resetGlossary = () => {
			showAllGlossaryItems();
			setActiveCategory();
			updateGlossaryNavigation();
		};

		/*
		 * Prevent disabled glossary navigation links from activating.
		 * Capture phase stops navigation before other handlers run.
		 */
		document.addEventListener(
			'click',
			(event) => {
				const disabledLink = event.target.closest(
					'#glossary-nav a[aria-disabled="true"]'
				);

				if (!disabledLink) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();
			},
			true
		);

		document.addEventListener('click', (event) => {
			/*
			 * Clear the current glossary filter.
			 */
			const clearLink = event.target.closest(
				'a[href="#clear"]'
			);

			if (clearLink) {
				event.preventDefault();
				resetGlossary();
				return;
			}

			/*
			 * Apply a category filter.
			 */
			const categoryLink = event.target.closest(
				categoryLinkSelector
			);

			if (!categoryLink) {
				return;
			}

			event.preventDefault();

			const selectedValue =
				categoryLink.dataset.text?.trim();

			if (!selectedValue) {
				return;
			}

			setActiveCategory(categoryLink);

			document.dispatchEvent(
				new CustomEvent('filterDefinitions', {
					detail: {
						value: selectedValue,
					},
				})
			);
		});

		document.addEventListener(
			'filterDefinitions',
			(event) => {
				const selectedValue =
					event.detail?.value?.trim();

				if (!selectedValue) {
					return;
				}

				const lists = document.querySelectorAll(
					'.wp-block-post-template'
				);

				/*
				 * Reset everything before applying the new filter.
				 */
				showAllGlossaryItems();

				const hasSelectedCategory = (definition) => {
					const categoryLinks =
						definition.querySelectorAll(
							'.taxonomy-glossary_category a[data-text]'
						);

					return [...categoryLinks].some(
						(categoryLink) =>
							categoryLink.dataset.text?.trim() ===
							selectedValue
					);
				};

				lists.forEach((list) => {
					const children = [...list.children];

					let currentGroup = null;
					let currentGroupHasMatch = false;

					const finishCurrentGroup = () => {
						if (!currentGroup) {
							return;
						}

						currentGroup.style.display =
							currentGroupHasMatch
								? 'block'
								: 'none';
					};

					children.forEach((child) => {
						if (
							child.matches(
								'.glossary-entry-group'
							)
						) {
							finishCurrentGroup();

							currentGroup = child;
							currentGroupHasMatch = false;

							const firstDefinition =
								child.querySelector(
									':scope > .glossary-entry-flex > .glossary-entry'
								);

							if (!firstDefinition) {
								return;
							}

							const matches =
								hasSelectedCategory(
									firstDefinition
								);

							firstDefinition.style.display =
								matches
									? 'block'
									: 'none';

							currentGroupHasMatch =
								matches;

							return;
						}

						if (
							child.matches(
								'.definitions.type-definitions'
							)
						) {
							const matches =
								hasSelectedCategory(
									child
								);

							child.style.display = matches
								? 'block'
								: 'none';

							if (matches) {
								currentGroupHasMatch =
									true;
							}
						}
					});

					finishCurrentGroup();
				});

				updateGlossaryNavigation();
			}
		);

		/*
		 * Establish the initial navigation and category states.
		 */
		setActiveCategory();
		updateGlossaryNavigation();
		updateGlossaryTags();
	});
};

window.digmodPluginGlossary = digmodPluginGlossary;

if ('complete' === document.readyState) {
	digmodPluginGlossary();
} else {
	document.addEventListener(
		'DOMContentLoaded',
		digmodPluginGlossary
	);
}