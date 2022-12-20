
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

    console.log('id: ', id, window.location);
    $('.edit-post-header__settings').prepend(`<button onclick="window.open(\'http://localhost:3000/wordpress-preview/${id}\','_blank');" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Preview on digital.gov.bc</button>`);
}
update();
// console.log('update func: ', update);
waitUntilElementLoad('.edit-post-header__settings',100,update)
