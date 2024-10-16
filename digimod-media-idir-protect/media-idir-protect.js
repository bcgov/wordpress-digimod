const placeholderHeight = 160;
const placeholderWidth = 544;

const domReadyForIDIRCheck = () => {
	/*
	 * SafarIE bug requires repaint update.
	 */
	window.requestAnimationFrame(() => {
		console.log('Checking for IDIR secured images');
		document.querySelectorAll('img').forEach(img => mediaIdirProtectHandleImage(img));
	});
};

async function mediaIdirProtectHandleImage(img) {
	const isProtectedImage = img.src.includes('/wp-uploads-idir-protected/');

	if (isProtectedImage) {
		// Replace HTTP with HTTPS if needed
		if (img.src.startsWith('http://')) {
			img.src = img.src.replace('http://', 'https://');
		}

		const urlWithNoCache = appendRandomParam(img.src);

		try {
			const response = await fetch(urlWithNoCache, { method: 'HEAD', redirect: 'manual' });

			// If the response is an opaque redirect, it's protected, so replace the image
			if (response.type === 'opaqueredirect') {
				replaceImageWithPlaceholder(img);
			}
		} catch (error) {
			// In case of fetch failure, replace with the placeholder image
			replaceImageWithPlaceholder(img);
		}
	}
}

function replaceImageWithPlaceholder(img) {
	const placeholderSrc = `${media_idir_protect_script_vars.plugin_dir}/${media_idir_protect_script_vars.placeholder_src}`;

	// Using onload event to set size after the image has fully loaded
	img.onload = () => {
		setPlaceholderSize(img);
	};

	// Change the image source to the placeholder with cache-busting
	img.src = appendRandomParam(placeholderSrc);
}

function setPlaceholderSize(img) {
	img.style.width = `${placeholderWidth}px`;
	img.style.height = `${placeholderHeight}px`;
	console.log(`Set image size: width=${placeholderWidth}px, height=${placeholderHeight}px`);
}

function appendRandomParam(url) {
	const timestamp = Date.now();
	return url.includes('?') ? `${url}&_cached_at=${timestamp}` : `${url}?_cached_at=${timestamp}`;
}

if (document.readyState === 'complete') {
	domReadyForIDIRCheck();
} else {
	document.addEventListener('DOMContentLoaded', domReadyForIDIRCheck);
}
