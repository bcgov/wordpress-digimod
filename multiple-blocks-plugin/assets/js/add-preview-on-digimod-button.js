
function waitUntilElementLoad(selector,  delay, callback) {
    // console.log('waitUntilElementLoad: ', selector,  delay, callback)
    if(document.querySelector(selector) != null){
        // element found; do something
        // console.log('callback: ', callback);
        callback()
    } else setTimeout(()=>waitUntilElementLoad(selector, delay, callback), delay);
}

function update(){
    // console.log('update!')
    const url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("post");
    jQuery('.edit-post-header__settings').prepend(`<button onclick="window.open(\'https://digital-gov-frontend-test-c0cce6-test.apps.silver.devops.gov.bc.ca/wordpress-preview/${id}\','_blank');" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Preview on digital.gov.bc.ca</button>`);
}
// update();
// console.log('update func: ', update);

export const addPreviewOnDigimodButton = () => {
    waitUntilElementLoad('.edit-post-header__settings',100,update)
}