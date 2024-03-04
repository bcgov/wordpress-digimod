import { addSafeEventListenerPlugin } from '../utils';

const windowLoad = () => {
    windowResize();
};

/**
 * Manage events after window resize.
 */
const windowResize = () => {
    /**
     * Set orientation helper classes on body.
     */
    const height = window.innerHeight;
    const width = document.body.clientWidth;
	setTimeout(() => {

		document.body.classList.remove( 'largeScreen' );
		document.body.classList.remove( 'tablet' );
		document.body.classList.remove( 'mobile' );        

	}, 50);
};

addSafeEventListenerPlugin( window, 'resize', windowResize );
addSafeEventListenerPlugin( window, 'load', windowLoad );