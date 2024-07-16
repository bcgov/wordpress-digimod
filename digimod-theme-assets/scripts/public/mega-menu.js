/**
 * Navigation DOM manipulation for Mega Menu display characteristics.
 *
 * Note: as this runs on all pages be sure to null check all elements before use.
 *
 * @return {void}
 */
const domReady = () => {
    /**
     * Handles pointer enter event for primary menu items.
     * @param {HTMLElement} item - The menu item element.
     */
    const handlePrimaryPointerEnter = (item) => {
        const subMenuContainer = item.querySelector('header .wp-block-navigation__submenu-container');
        const popularContentShowing = document.querySelector('.live-search-extra');

        if (subMenuContainer && !popularContentShowing) {
            const firstSubMenuItemButton = subMenuContainer.querySelector('.wp-block-navigation-item:first-child button');

            if (firstSubMenuItemButton && firstSubMenuItemButton.getAttribute('aria-expanded') === 'false') {
                firstSubMenuItemButton.focus();
                firstSubMenuItemButton.click();
                firstSubMenuItemButton.blur();
            }
        }

        const itemMenuSubUL = item.querySelector('header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');
        if (itemMenuSubUL && !itemMenuSubUL.isCheckedForHeight) {
            const parentULContainer = itemMenuSubUL.parentNode.parentNode;

            if (parentULContainer.clientHeight <= itemMenuSubUL.clientHeight) {
                parentULContainer.style.height = `${itemMenuSubUL.clientHeight}px`;
            }

            itemMenuSubUL.isCheckedForHeight = true;
        }
    };

    /**
     * Handles pointer leave event for primary menu items.
     * @param {HTMLElement} item - The menu item element.
     */
    const handlePrimaryPointerLeave = (item) => {
        const subMenuContainer = item.querySelector('header .wp-block-navigation__submenu-container');
        const firstSubMenuItemButton = subMenuContainer.querySelector('.wp-block-navigation-item:first-child button');

        if (firstSubMenuItemButton) {
            firstSubMenuItemButton.setAttribute('aria-expanded', 'false');
        }
    };

    /**
     * Initializes primary menu items with event listeners.
     */
    const initializePrimaryMenuItems = () => {
        const primaryMenuListItems = document.querySelectorAll(
            'header nav > .wp-block-navigation__container > .wp-block-navigation-item.has-child'
        );

        if (primaryMenuListItems.length > 0) {
            primaryMenuListItems.forEach((item) => {
                item.addEventListener('pointerenter', () => handlePrimaryPointerEnter(item));
                item.addEventListener('pointerleave', () => handlePrimaryPointerLeave(item));
            });
        }
    };

    /**
     * Handles pointer enter event for secondary menu items.
     * @param {HTMLElement} parentLI - The parent list item element.
     */
    const handleSecondaryPointerEnter = (parentLI) => {
        const menuItemMenuSubUL = parentLI.querySelector('header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');
        menuItemMenuSubUL.style.width = '66vw';

        const parentSubULContainer = menuItemMenuSubUL.parentNode.parentNode;
        const mainMenuContainer = parentSubULContainer;
        const subMenuListContainer = menuItemMenuSubUL;

        if (menuItemMenuSubUL && !subMenuListContainer.isSubULCheckedForHeight) {
            if (mainMenuContainer.clientHeight <= subMenuListContainer.clientHeight) {
                mainMenuContainer.style.height = `${subMenuListContainer.clientHeight}px`;
                menuItemMenuSubUL.style.height = 'calc(100% - 3rem)';
            } else {
                mainMenuContainer.style.height = `${mainMenuContainer.clientHeight}px`;
                menuItemMenuSubUL.style.height = '100%';
            }

            subMenuListContainer.isSubULCheckedForHeight = true;
        }
    };

    /**
     * Initializes secondary menu items with event listeners and headline elements.
     */
    const initializeSecondaryMenuItems = () => {
        const menuSubUL = document.querySelectorAll('header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container');

        if (menuSubUL.length > 0) {
            menuSubUL.forEach((menuItem) => {
                const parentLI = menuItem.parentNode;
                const headline = document.createElement('li');
                headline.classList.add('headline');
                const link = document.createElement('a');
                link.href = parentLI.firstChild.href;
                link.textContent = parentLI.firstChild.textContent;
                headline.appendChild(link);
                menuItem.prepend(headline);
                menuItem.style.width = '66vw';

                parentLI.addEventListener('pointerenter', () => handleSecondaryPointerEnter(parentLI));
            });
        }
    };

    /**
     * Handles pointer enter and leave events for secondary level links.
     * @param {HTMLElement} secondaryLink - The secondary link element.
     */
    const handleSecondaryLinkPointer = (secondaryLink) => {
        secondaryLink.addEventListener('pointerenter', (e) => {
            const theLink = e.target;
            const topSiblingContainer = theLink.closest('ul');
            const topSibling = topSiblingContainer.querySelector('li');
            const topSiblingSubmenu = topSibling.querySelector('ul');
            if (topSiblingSubmenu) {
                topSiblingSubmenu.style.display = 'none';
            }
        });

        secondaryLink.addEventListener('pointerleave', (e) => {
            const theLink = e.target;
            const topSiblingContainer = theLink.closest('ul');
            const topSibling = topSiblingContainer.querySelector('li');
            const topSiblingSubmenu = topSibling.querySelector('ul');
            if (topSiblingSubmenu) {
                topSiblingSubmenu.style.display = 'block';
            }
        });
    };

    /**
     * Initializes secondary level links with event listeners.
     */
    const initializeSecondaryLevelLinks = () => {
        setTimeout(() => {
            const onlySecondaryLevelLink = document.querySelectorAll(
                'header nav.wp-block-navigation > ul.wp-block-navigation__container > li > ul.wp-block-navigation__submenu-container > li.wp-block-navigation-link > a.wp-block-navigation-item__content'
            );

            if (onlySecondaryLevelLink) {
                onlySecondaryLevelLink.forEach((secondaryLink) => {
                    secondaryLink.classList.add('no-sub-menu');
                    handleSecondaryLinkPointer(secondaryLink);
                });
            }
        }, 50);
    };

    // Initialize all menu items and links
    initializePrimaryMenuItems();
    initializeSecondaryMenuItems();
    initializeSecondaryLevelLinks();
};

// DOMContentLoaded event to ensure DOM is fully loaded
if (document.readyState === 'complete') {
    domReady();
} else {
    document.addEventListener('DOMContentLoaded', domReady);
}
