/**
 * Navigation DOM manipulation for Mega Menu display characteristics.
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
         * This handles the behavior of WordPress navigation menu and submenus as a mega menu.
         */
        const primaryMenuListItems = document.querySelectorAll(
            'header nav > .wp-block-navigation__container > .wp-block-navigation-item.has-child'
        );

        if (primaryMenuListItems.length > 0) {
            primaryMenuListItems.forEach((item) => {
                const subMenuContainer = item.querySelector(
                    'header .wp-block-navigation__submenu-container'
                );

                let isCheckedForHeight = false;

                item.addEventListener('pointerenter', () => {
                    if (subMenuContainer) {
                        const firstSubMenuItemButton =
                            subMenuContainer.querySelector(
                                '.wp-block-navigation-item:first-child button'
                            );

                        if (
                            firstSubMenuItemButton &&
                            firstSubMenuItemButton.getAttribute(
                                'aria-expanded'
                            ) === 'false'
                        ) {
                            firstSubMenuItemButton.focus();
                            firstSubMenuItemButton.click();
                            firstSubMenuItemButton.blur();
                        }
                    }

                    const itemMenuSubUL = item.querySelector(
                        'header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
                    );

                    if (itemMenuSubUL && !isCheckedForHeight) {
                        const parentULContainer =
                            itemMenuSubUL.parentNode.parentNode;

                        if (
                            parentULContainer.clientHeight <=
                            itemMenuSubUL.clientHeight
                        ) {
                            parentULContainer.style.height = `${itemMenuSubUL.clientHeight}px`;
                        }

                        isCheckedForHeight = true;
                    }
                });

                item.addEventListener('pointerleave', () => {
                    const firstSubMenuItemButton =
                        subMenuContainer.querySelector(
                            '.wp-block-navigation-item:first-child button'
                        );

                    if (firstSubMenuItemButton) {
                        firstSubMenuItemButton.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    }
                });
            });
        }

        const menuSubUL = document.querySelectorAll(
            'header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
        );

        if (menuSubUL.length > 0) {
            menuSubUL.forEach((menuItem) => {
                const parentLI = menuItem.parentNode;
                const headline = document.createElement('li');
                headline.classList.add('headline');
                const link = document.createElement('a');
                link.href = parentLI.firstChild.href;
                link.textContent = parentLI.firstChild.textContent;
                link.textContent = parentLI.firstChild.textContent;
                headline.appendChild(link);
                menuItem.prepend(headline);
                menuItem.style.width = '66vw';

                let isSubULCheckedForHeight = false;

                parentLI.addEventListener('pointerenter', () => {
                    const menuItemMenuSubUL = parentLI.querySelector(
                        'header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container'
                    );

                    menuItemMenuSubUL.style.width = '66vw';

                    const parentSubULContainer =
                        menuItemMenuSubUL.parentNode.parentNode;
                    const mainMenuContainer = parentSubULContainer;
                    const subMenuListContainer = menuItemMenuSubUL;

                    if (menuItemMenuSubUL && !isSubULCheckedForHeight) {
                        if (
                            mainMenuContainer.clientHeight <=
                            subMenuListContainer.clientHeight
                        ) {
                            mainMenuContainer.style.height = `${subMenuListContainer.clientHeight}px`;
                            menuItemMenuSubUL.style.height =
                                'calc(100% - 3rem)';
                        } else {
                            mainMenuContainer.style.height = `${mainMenuContainer.clientHeight}px`;
                            menuItemMenuSubUL.style.height = '100%';
                        }

                        isSubULCheckedForHeight = true;
                    }
                });
            });
        }

        setTimeout(function () {
            const onlySecondaryLevelLink = document.querySelectorAll(
                'header nav.wp-block-navigation > ul.wp-block-navigation__container > li > ul.wp-block-navigation__submenu-container > li.wp-block-navigation-link > a.wp-block-navigation-item__content'
            );
            if (onlySecondaryLevelLink) {
                onlySecondaryLevelLink.forEach((secondaryLink) => {
                    secondaryLink.classList.add('no-sub-menu');
                    secondaryLink.addEventListener('pointerenter', (e) => {
                        const theLink = e.target;
                        const topSiblingContainer = theLink.closest('ul');
                        const topSibling =
                            topSiblingContainer.querySelector('li');
                        const topSiblingSubmenu =
                            topSibling.querySelector('ul');
                        if (topSiblingSubmenu) {
                            topSiblingSubmenu.style.display = 'none';
                        }
                    });

                    secondaryLink.addEventListener('pointerleave', (e) => {
                        const theLink = e.target;
                        const topSiblingContainer = theLink.closest('ul');
                        const topSibling =
                            topSiblingContainer.querySelector('li');
                        const topSiblingSubmenu =
                            topSibling.querySelector('ul');
                        if (topSiblingSubmenu) {
                            topSiblingSubmenu.style.display = 'block';
                        }
                    });
                });
            }
        }, 50);
    }, 0);
};

if ('complete' === document.readyState) {
    domReady();
} else {
    document.addEventListener('DOMContentLoaded', domReady);
}
