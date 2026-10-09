/**
 * General Digimod Definitons dialog generator.
 */
export const digmodPluginDefnitions = () => {
    /*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
        window.requestAnimationFrame(() => {
        const definitionLinkSelector =
            'a:not(.digimod-vue-app-root a, [href*="#top"])';
        const vueDefinitionLinkSelector = 'a:not([href*="#top"])';
        const protectedAreaBlockSelector = '.cleanbcdx-protected-area-block';
        const protectedAreaFormSelector = '.cleanbcdx-protected-area__form';
        const glossaryPath = '/glossary';
        const glossaryApiPath = '/wp-json/digimod/v1/glossary?_fields=link';
        const glossaryDefinitionUrlsStorageKey =
            'digimodGlossaryDefinitionUrls';
        let glossaryDefinitionUrlsPromise = null;

        const getDefinitionUrl = (triggerElement) => {
            if (!triggerElement?.href) {
                return '';
            }

            try {
                return new window.URL(triggerElement.href, window.location.href)
                    .href;
            } catch {
                return '';
            }
        };

        const normalizeDefinitionUrl = (url) => {
            if (!url) {
                return '';
            }

            try {
                const normalizedUrl = new window.URL(url, window.location.href);

                normalizedUrl.hash = '';
                normalizedUrl.search = '';

                const normalizedPath =
                    normalizedUrl.pathname.replace(/\/+$/, '') || '/';

                return `${normalizedUrl.origin}${normalizedPath}`;
            } catch {
                return '';
            }
        };

        const getCachedGlossaryDefinitionUrls = () => {
            const cachedData = window.sessionStorage.getItem(
                glossaryDefinitionUrlsStorageKey
            );

            if (!cachedData) {
                return null;
            }

            try {
                const parsedData = JSON.parse(cachedData);

                if (!Array.isArray(parsedData)) {
                    throw new Error('Invalid glossary definition URL cache.');
                }

                return new Set(
                    parsedData
                        .map((definitionUrl) =>
                            normalizeDefinitionUrl(definitionUrl)
                        )
                        .filter(Boolean)
                );
            } catch {
                window.sessionStorage.removeItem(
                    glossaryDefinitionUrlsStorageKey
                );

                return null;
            }
        };

        const cacheGlossaryDefinitionUrls = (definitionUrls) => {
            if (!(definitionUrls instanceof Set)) {
                return;
            }

            window.sessionStorage.setItem(
                glossaryDefinitionUrlsStorageKey,
                JSON.stringify(Array.from(definitionUrls))
            );
        };

        const fetchGlossaryDefinitionUrls = async () => {
            const response = await fetch(glossaryApiPath);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const glossaryEntries = await response.json();
            const glossaryDefinitionUrls = new Set(
                (Array.isArray(glossaryEntries) ? glossaryEntries : [])
                    .map((entry) => normalizeDefinitionUrl(entry?.link))
                    .filter(Boolean)
            );

            cacheGlossaryDefinitionUrls(glossaryDefinitionUrls);

            return glossaryDefinitionUrls;
        };

        const getGlossaryDefinitionUrls = () => {
            if (glossaryDefinitionUrlsPromise) {
                return glossaryDefinitionUrlsPromise;
            }

            const cachedGlossaryDefinitionUrls =
                getCachedGlossaryDefinitionUrls();

            if (cachedGlossaryDefinitionUrls) {
                glossaryDefinitionUrlsPromise = Promise.resolve(
                    cachedGlossaryDefinitionUrls
                );

                return glossaryDefinitionUrlsPromise;
            }

            glossaryDefinitionUrlsPromise = fetchGlossaryDefinitionUrls().catch(
                (error) => {
                    glossaryDefinitionUrlsPromise = null;
                    throw error;
                }
            );

            return glossaryDefinitionUrlsPromise;
        };

        const contentHasProtectedArea = (content) => {
            if (!content) {
                return false;
            }

            const container = document.createElement('div');
            container.innerHTML = content;

            return Boolean(container.querySelector(protectedAreaBlockSelector));
        };

        const parseDefinitionData = (html) => {
            const parser = new window.DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const titleElement = doc.querySelector('.wp-block-post-title');
            const contentElement = doc.querySelector('.entry-content');

            if (!titleElement || !contentElement) {
                throw new Error(
                    'Required content not found in the fetched HTML.'
                );
            }

            return {
                title: titleElement.innerText,
                content: contentElement.innerHTML,
                hasProtectedArea: Boolean(
                    contentElement.querySelector(protectedAreaBlockSelector)
                ),
            };
        };

        const buildDefinitionDialogData = async (
            definitionData,
            fallbackUrl = '',
            glossaryDefinitionUrlsRequest = null
        ) => {
            const resolvedDefinitionUrl = definitionData?.url || fallbackUrl;

            if ('boolean' === typeof definitionData?.showInGlossary) {
                return {
                    ...definitionData,
                    url: resolvedDefinitionUrl,
                };
            }

            try {
                const glossaryDefinitionUrls = await (
                    glossaryDefinitionUrlsRequest ||
                    getGlossaryDefinitionUrls()
                );

                return {
                    ...definitionData,
                    url: resolvedDefinitionUrl,
                    showInGlossary: glossaryDefinitionUrls.has(
                        normalizeDefinitionUrl(resolvedDefinitionUrl)
                    ),
                };
            } catch (error) {
                console.error(
                    'Error fetching glossary definition URLs:',
                    error
                );

                return {
                    ...definitionData,
                    url: resolvedDefinitionUrl,
                    showInGlossary: false,
                };
            }
        };

        const getCachedDefinitionData = (url) => {
            const cachedData = window.sessionStorage.getItem(url);

            if (!cachedData) {
                return null;
            }

            try {
                const parsedData = JSON.parse(cachedData);

                if (
                    'string' !== typeof parsedData?.title ||
                    'string' !== typeof parsedData?.content ||
                    ('showInGlossary' in parsedData &&
                        'boolean' !== typeof parsedData.showInGlossary)
                ) {
                    window.sessionStorage.removeItem(url);
                    return null;
                }

                if (contentHasProtectedArea(parsedData.content)) {
                    window.sessionStorage.removeItem(url);
                    return null;
                }

                return parsedData;
            } catch {
                window.sessionStorage.removeItem(url);
                return null;
            }
        };

        const cacheDefinitionData = (url, definitionData) => {
            if (!url) {
                return;
            }

            if (definitionData.hasProtectedArea) {
                window.sessionStorage.removeItem(url);
                return;
            }

            window.sessionStorage.setItem(
                url,
                JSON.stringify({
                    title: definitionData.title,
                    content: definitionData.content,
                    showInGlossary: Boolean(definitionData.showInGlossary),
                })
            );
        };

        const fetchDefinitionData = async (url, options = {}) => {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const html = await response.text();

            return {
                ...parseDefinitionData(html),
                url: response.url || url,
            };
        };

        const syncProtectedAreaForms = (dialogContent, definitionUrl) => {
            if (!dialogContent || !definitionUrl) {
                return;
            }

            dialogContent
                .querySelectorAll(protectedAreaFormSelector)
                .forEach((form) => {
                    form.setAttribute('action', definitionUrl);
                });
        };

        const getGlossaryFooterMarkup = (showInGlossary) => {
            if (!showInGlossary) {
                return '';
            }

            return (
                '<footer class="definition-dialog-footer">' +
                '<a class="definition-dialog-footer__link" href="' +
                glossaryPath +
                '">Explore the glossary</a>' +
                '</footer>'
            );
        };

        const setDialogWideState = (isWide) => {
            const dialog = document.getElementById('dialog');

            if (!dialog) {
                return;
            }

            dialog.dataset.definitionWide = isWide ? 'true' : 'false';
            setDialogWidth(isWide);
        };

        const setDialogPinToTopState = (isPinned) => {
            const dialog = document.getElementById('dialog');

            if (!dialog) {
                return;
            }

            dialog.dataset.definitionPinned = isPinned ? 'true' : 'false';
            setDialogPinned(isPinned);
        };

        /**
         * Adds event listeners for click and keypress events to the specified element.
         *
         * @param {HTMLElement} element - The DOM element to which the event listeners will be added.
         *
         * @fires click - Triggered when the element is clicked.
         * @fires keypress - Triggered when a key is pressed while the element is focused.
         */
        const addEventListeners = (element) => {
            element.addEventListener('click', handleClick);
            element.addEventListener('keypress', handleKeypress);
        };

        const setDefinitionLoadingState = (element, isLoading) => {
            if (!(element instanceof HTMLElement)) {
                return;
            }

            element.classList.toggle('is-loading-definition', isLoading);

            if (isLoading) {
                element.dataset.definitionLoading = 'true';
                element.setAttribute('aria-busy', 'true');
                return;
            }

            delete element.dataset.definitionLoading;
            element.removeAttribute('aria-busy');
        };

        /**
         * Handles click and keypress events, fetching and displaying content based on a URL.
         *
         * @async
         * @param {Event} event - The event object triggered by a user interaction.
         * @property {string} event.type - The type of the event (e.g., 'click', 'keypress').
         * @property {string} [event.key] - The key pressed during a keypress event (e.g., 'Enter').
         * @property {HTMLElement} event.currentTarget - The element on which the event listener is attached.
         *
         * @throws {Error} Throws an error if the fetch operation fails or required elements are not found.
         *
         * @description
         * - If the event is a `click` or a `keypress` with the `Enter` key, the function prevents the default action.
         * - It checks if the URL's content is cached in `sessionStorage`.
         * - If cached, it retrieves and displays the content.
         * - If not cached, it fetches the content from the URL, parses it, and displays it.
         * - The fetched content is cached in `sessionStorage` for future use.
         */
        const handleClick = async (event) => {
            if (
                'click' === event.type ||
                ('keypress' === event.type && 'Enter' === event.key)
            ) {
                const triggerElement = event.currentTarget;

                if (!(triggerElement instanceof HTMLElement)) {
                    return;
                }

                if ('true' === triggerElement.dataset.definitionLoading) {
                    return;
                }

                event.preventDefault();
                setDialogWideState(shouldUseWideDialog(triggerElement));
                setDialogPinToTopState(shouldPinToTopDialog(triggerElement));
                const url = getDefinitionUrl(triggerElement);

                if (!url) {
                    return;
                }

                const cachedData = getCachedDefinitionData(url);

                if (cachedData) {
                    const definitionDialogData =
                        await buildDefinitionDialogData(cachedData, url);

                    displayContent(
                        definitionDialogData.title,
                        definitionDialogData.content,
                        definitionDialogData.url,
                        definitionDialogData.showInGlossary
                    );
                } else {
                    setDefinitionLoadingState(triggerElement, true);

                    try {
                        const glossaryDefinitionUrls =
                            getGlossaryDefinitionUrls();
                        const definitionData = await fetchDefinitionData(url);
                        const definitionDialogData =
                            await buildDefinitionDialogData(
                                definitionData,
                                url,
                                glossaryDefinitionUrls
                            );

                        cacheDefinitionData(url, definitionDialogData);
                        displayContent(
                            definitionDialogData.title,
                            definitionDialogData.content,
                            definitionDialogData.url,
                            definitionDialogData.showInGlossary
                        );
                    } catch (error) {
                        console.error('Error fetching content:', error);
                    } finally {
                        setDefinitionLoadingState(triggerElement, false);
                    }
                }
            }
        };

        /**
         * Handles keypress events, triggering the `handleClick` function if the Enter key is pressed.
         *
         * @param {KeyboardEvent} event - The keyboard event object.
         * @property {string} event.key - The name of the key pressed (e.g., 'Enter').
         * @property {number} [event.keyCode] - The numeric keycode of the key pressed (e.g., 13 for Enter).
         *
         * @description
         * - Checks if the key pressed is the Enter key.
         * - If the Enter key is detected, the function delegates handling to the `handleClick` function.
         */
        const handleKeypress = (event) => {
            if ('Enter' === event.key || 13 === event.keycode) {
                handleClick(event);
            }
        };

        const initializeDefinitionLinks = (
            rootElement = document,
            includeVueLinks = false
        ) => {
            if (!rootElement || 'function' !== typeof rootElement.querySelectorAll) {
                return [];
            }

            const activeDefinitionLinkSelector = includeVueLinks
                ? vueDefinitionLinkSelector
                : definitionLinkSelector;

            const definitionLinks = Array.from(
                rootElement.querySelectorAll(activeDefinitionLinkSelector)
            ).filter((link) => {
                return link.href.includes('definitions');
            });

            definitionLinks.forEach((link) => {
                if ('true' === link.dataset.definitionInit) {
                    return;
                }

                link.dataset.definitionInit = 'true';
                link.classList.add('icon-definition');
                link.setAttribute(
                    'aria-label',
                    'opens definition dialog for this concept'
                );

                const linkText = link.textContent;

                if (linkText && linkText.trim().length > 0) {
                    const words = linkText.trim().split(' ');
                    const lastWord = words.pop();
                    const restOfText = words.join(' ');

                    // Create a span element for the last word.
                    const span = document.createElement('span');
                    span.classList.add('last-word', 'no-wrap');
                    span.textContent = lastWord;

                    link.innerHTML = `${restOfText} `;
                    link.appendChild(span);
                }

                addEventListeners(link);
            });

            return definitionLinks;
        };

        const initializeDefinitionExperience = (
            rootElement = document,
            includeVueLinks = false
        ) => {
            const definitionLinks = initializeDefinitionLinks(
                rootElement,
                includeVueLinks
            );

            if (definitionLinks.length > 0) {
                let dialog = document.getElementById('dialog');
                const needsDialog = !dialog;

                if (needsDialog) {
                    dialog = document.createElement('dialog');
                    dialog.id = 'dialog';
                    dialog.className = 'dialog';
                    dialog.setAttribute('aria-modal', true);
                    dialog.setAttribute('aria-live', 'polite');
                    dialog.innerHTML =
                        '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
                    document.body.appendChild(dialog);

                    const closeDialogButton =
                        document.getElementById('close-dialog');

                    closeDialogButton.addEventListener('click', () => {
                        dialog.close();
                        setDialogWideState(false);
                        setDialogPinToTopState(false);
                    });

                    dialog.addEventListener('close', () => {
                        setDialogWideState(false);
                        setDialogPinToTopState(false);
                        setBodyScrollLock(false);
                    });

                    dialog.addEventListener('click', closeDialogOnBackdropClick);
                    dialog.addEventListener('submit', handleProtectedAreaSubmit);
                }
            }

            return definitionLinks;
        };

        /**
         * Displays the specified content in a dialog and sets focus on the title.
         *
         * @param {string} title - The title to be displayed in the dialog.
         * @param {string} content - The HTML content to be displayed in the dialog.
         * @param {string} definitionUrl - The definition page URL used for protected-area form submissions.
         * @param {boolean} showInGlossary - Whether the glossary footer link should be shown.
         *
         * @description
         * - Updates the content of the dialog's `.dialog-content` element.
         * - Sets the `tabindex` of the title to `0` to make it focusable.
         * - Calls `showDialog()` to display the dialog.
         * - Moves focus to the title (`<h2>` element) after rendering.
         */
        const displayContent = (
            title,
            content,
            definitionUrl = '',
            showInGlossary = false
        ) => {
            const dialog = document.getElementById('dialog');
            const dialogContent = document.querySelector(
                '#dialog .dialog-content'
            );

            if (!dialog || !dialogContent) {
                return;
            }

            dialog.dataset.definitionUrl = definitionUrl;
            dialog.dataset.definitionShowInGlossary = showInGlossary
                ? 'true'
                : 'false';
            setDialogWidth('true' === dialog.dataset.definitionWide);
            setDialogPinned('true' === dialog.dataset.definitionPinned);
            dialogContent.innerHTML =
                '<h2 tabindex="0">' +
                title +
                '</h2>' +
                content +
                getGlossaryFooterMarkup(showInGlossary);

            initializeDefinitionLinks(dialogContent);
            syncProtectedAreaForms(dialogContent, definitionUrl);
            showDialog();

            const focusTarget =
                dialogContent.querySelector('[autofocus]') ||
                dialogContent.querySelector('h2');

            if (focusTarget instanceof HTMLElement) {
                focusTarget.focus();
            }
        };

        /**
         * Displays a dialog element using the `showModal` method.
         *
         * @description
         * - Retrieves the dialog element with the ID `dialog`.
         * - Opens the dialog using the `showModal()` method, which displays it as a modal dialog.
         *
         * @throws {TypeError} Throws an error if the dialog element does not exist or is not a valid HTMLDialogElement.
         */
        const showDialog = () => {
            const dialog = document.getElementById('dialog');

            if (!dialog) {
                return;
            }

            setBodyScrollLock(true);

            if (dialog.open) {
                return;
            }

            dialog.showModal();
        };

        const handleProtectedAreaSubmit = async (event) => {
            const form = event.target;
            const dialog = document.getElementById('dialog');

            if (
                !dialog ||
                !(form instanceof HTMLFormElement) ||
                !form.matches(protectedAreaFormSelector) ||
                !dialog.contains(form)
            ) {
                return;
            }

            const definitionUrl =
                dialog.dataset.definitionUrl ||
                form.getAttribute('action') ||
                '';

            if (!definitionUrl) {
                return;
            }

            event.preventDefault();
            form.setAttribute('action', definitionUrl);
            dialog.dataset.definitionWide = dialog.classList.contains('wide')
                ? 'true'
                : 'false';
            dialog.dataset.definitionPinned = dialog.classList.contains('pin-to-top')
                ? 'true'
                : 'false';

            const submitButton = event.submitter;

            if (
                submitButton instanceof HTMLButtonElement ||
                submitButton instanceof HTMLInputElement
            ) {
                submitButton.disabled = true;
            }

            try {
                const glossaryDefinitionUrls = getGlossaryDefinitionUrls();
                const definitionData = await fetchDefinitionData(definitionUrl, {
                    method: 'POST',
                    body: new window.FormData(form),
                });
                const definitionDialogData = await buildDefinitionDialogData(
                    definitionData,
                    definitionUrl,
                    glossaryDefinitionUrls
                );

                cacheDefinitionData(definitionUrl, definitionDialogData);
                displayContent(
                    definitionDialogData.title,
                    definitionDialogData.content,
                    definitionDialogData.url,
                    definitionDialogData.showInGlossary
                );
            } catch (error) {
                console.error(
                    'Error submitting protected content form:',
                    error
                );
                form.submit();
            } finally {
                if (
                    submitButton instanceof HTMLButtonElement ||
                    submitButton instanceof HTMLInputElement
                ) {
                    submitButton.disabled = false;
                }
            }
        };

        const setBodyScrollLock = (isLocked) => {
            const html = document.documentElement;
            const body = document.body;

            if (!html || !body) {
                return;
            }

            if (isLocked) {
                html.style.overflow = 'hidden';
                body.style.margin = '0';
                body.style.height = '100%';
                body.style.overflow = 'hidden';
                body.style.left = '0';
                body.style.right = '0';
                body.style.width = '100%';
                return;
            }

            html.style.overflow = '';
            body.style.margin = '';
            body.style.height = '';
            body.style.overflow = '';
            body.style.left = '';
            body.style.right = '';
            body.style.width = '';
        };

        const setDialogWidth = (isWide) => {
            const dialog = document.getElementById('dialog');

            if (!dialog) {
                return;
            }

            dialog.classList.toggle('wide', isWide);
        };

        const setDialogPinned = (isPinned) => {
            const dialog = document.getElementById('dialog');

            if (!dialog) {
                return;
            }

            dialog.classList.toggle('pin-to-top', isPinned);
        };

        const closeDialogOnBackdropClick = (event) => {
            const dialog = event.currentTarget;

            if (!dialog || !dialog.open) {
                return;
            }

            if (event.target !== dialog) {
                return;
            }

            const rect = dialog.getBoundingClientRect();
            const isInsideDialogBounds =
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom;

            if (!isInsideDialogBounds) {
                dialog.close();
            }
        };

        const shouldUseWideDialog = (triggerElement) => {
            if (!triggerElement) {
                return false;
            }

            if (triggerElement.classList.contains('wide')) {
                return true;
            }

            return Boolean(triggerElement.closest('.wide'));
        };

        const shouldPinToTopDialog = (triggerElement) => {
            if (!triggerElement) {
                return false;
            }

            if (triggerElement.classList.contains('pin-to-top')) {
                return true;
            }

            return Boolean(triggerElement.closest('.pin-to-top'));
        };

        initializeDefinitionExperience();

        window.digmodInitializeDefinitionExperience =
            initializeDefinitionExperience;

        // Glossary list processor.
        const glossaryList = document.querySelector('.glossary-results ul');
        const glossaryNavContainer = document.querySelector(
            '#glossary-nav .wp-block-buttons'
        );
        const sampleButton =
            glossaryNavContainer?.querySelector('.wp-block-button');

        // Only run if required elements exist.
        if (!glossaryList || !glossaryNavContainer || !sampleButton) return;

        // Gather glossary items.
        const glossaryItems = Array.from(glossaryList.querySelectorAll('li'));
        let currentLetter = '';
        const letterAnchors = new Set();
        const usedTitleIds = new Map();

        const toSlug = (value) => {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return slug.length > 0 ? slug : 'glossary-term';
        };

        const getUniqueId = (base) => {
            const existingCount = usedTitleIds.get(base) || 0;
            const nextCount = existingCount + 1;
            usedTitleIds.set(base, nextCount);
            return 0 === existingCount ? base : `${base}-${nextCount}`;
        };

        glossaryItems.forEach((item) => {
            const titleElement = item.querySelector('h3');
            if (!titleElement) return;

            const titleText = titleElement.textContent.trim();
            const titleIdBase = toSlug(titleText);
            titleElement.id = getUniqueId(titleIdBase);
            const firstLetter = titleText.charAt(0).toUpperCase();

            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                letterAnchors.add(currentLetter); // Collect for nav

                // Create <h2 id="glossary-a">A</h2>
                const h2 = document.createElement('h2');
                h2.textContent = currentLetter;
                h2.id = `glossary-${currentLetter.toLowerCase()}`;
                h2.classList.add('glossary-inline-letter');

                // Create wrapper <li>
                const wrapper = document.createElement('li');
                wrapper.classList.add('glossary-entry-group');

                // Create flex container
                const flexContainer = document.createElement('div');
                flexContainer.classList.add('glossary-entry-flex');

                // Create a div to hold the term content (instead of <li>)
                const termWrapper = document.createElement('div');
                termWrapper.classList.add('glossary-entry');

                // Move the item's children into the termWrapper
                while (item.firstChild) {
                    termWrapper.appendChild(item.firstChild);
                }

                // Add <h2> and term to the flex container
                flexContainer.appendChild(h2);
                flexContainer.appendChild(termWrapper);

                // Add the flex container to the wrapper <li>
                wrapper.appendChild(flexContainer);

                // Replace the original <li> with the new wrapper
                glossaryList.replaceChild(wrapper, item);
            }
        });

        // Build letter buttons inside glossaryNavContainer.
        letterAnchors.forEach((letter) => {
            const newButtonWrapper = sampleButton.cloneNode(true);
            const newButtonLink = newButtonWrapper.querySelector('a');

            if (newButtonLink) {
                newButtonLink.textContent = letter;
                newButtonLink.setAttribute(
                    'href',
                    `#glossary-${letter.toLowerCase()}`
                );
                newButtonWrapper.classList.remove('invisible');
            }

            glossaryNavContainer.appendChild(newButtonWrapper);
        });

        // Remove the original sample button.
        sampleButton.remove();
    });
};

window.digmodPluginDefnitions = digmodPluginDefnitions;

if ('complete' === document.readyState) {
    digmodPluginDefnitions();
} else {
    document.addEventListener(
        'DOMContentLoaded',
        digmodPluginDefnitions
    );
}
