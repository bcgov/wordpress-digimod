const placeholderHeight = 160;
const placeholderWidth = 544;

function mediaIdirProtectHandleImage(img) {
	const isProtectedImage = img.src.includes('/wp-uploads-idir-protected/');

	if(isProtectedImage){
		
		if (img.src.startsWith('http://')) {
			img.src = img.src.replace('http://', 'https://');
		}

		const urlWithNoCache = appendRandomParam(img.src);

		fetch(urlWithNoCache, { method: 'HEAD', redirect: 'manual' }).then(response => {
			//If we can fetch it and its not a redirect, then its not the IDIR login. Leave it alone.
			if(response.type == 'opaqueredirect'){
				replaceImageWithPlaceholder(img);
			}

		}).catch(error => {
			replaceImageWithPlaceholder(img);
		});
	}
}

function replaceImageWithPlaceholder(img){
	const placeholderSrc = `${media_idir_protect_script_vars.plugin_dir}/${media_idir_protect_script_vars.placeholder_src}`;
	img.src = appendRandomParam(placeholderSrc);
	setPlaceholderSize(img);
}

function setPlaceholderSize(img) {
    img.style.width = `${placeholderWidth}px`;
    img.style.height = `${placeholderHeight}px`;
}

function appendRandomParam(url) {
    const timestamp = Date.now();
    return url.includes('?') ? `${url}&_cached_at=${timestamp}` : `${url}?_cached_at=${timestamp}`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => mediaIdirProtectHandleImage(img));
});