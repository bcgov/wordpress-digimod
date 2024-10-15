const placeholderSrc = 'unauth-placeholder.png';  
const placeholderHeight = 160;
const placeholderWidth = 544;

function mediaIdirProtectHandleImage(img) {
	//console.log(img);

	
	var isProtectedImage = img.src.indexOf('/wp-uploads-idir-protected/') != -1;

	if(isProtectedImage){
		//console.log(img);
		
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
	img.src = appendRandomParam(media_idir_protect_script_vars.plugin_dir + '/' + placeholderSrc);
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

jQuery(document).ready(function() {
	document.querySelectorAll('img').forEach(img => mediaIdirProtectHandleImage(img));

	
});