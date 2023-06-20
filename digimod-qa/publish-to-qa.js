
// alert('publish-to-qa');

function waitUntilElementLoad(selector,  delay, callback) {
    // wait until relevant dom elements are present on the page to perform necessary dom manipulations to augment the UI
    // todo: this is not the most optimal way to perform this function


    // console.log('waitUntilElementLoad: ', selector,  delay, callback)
    if(document.querySelector(selector) != null){
        // element found; do something
        console.log('doing callback.. ');

        setTimeout(callback(), 5000);
        
    } else {
        setTimeout(()=>waitUntilElementLoad(selector, delay, callback), delay);
    }
}

var ran = false;
function update(){
    if (ran)
        return

    ran = true;
    console.log('update!')
    const url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("post");
    

    // this reloads the page when the page was published (to renew the UI)
    let wasSavingPost =false;//wp.data.select('core/editor').isSavingPost();
    let wasPublishingPost =false;// wp.data.select('core/editor').isPublishingPost();

    wp.data.subscribe(() => {
        const isSavingPost = wp.data.select('core/editor').isSavingPost();
        const isPublishingPost = wp.data.select('core/editor').isPublishingPost();

        if (wasSavingPost && !isSavingPost && wasPublishingPost && !isPublishingPost) {
            // Post was being saved and published, but is no longer being saved or published.
            // Thus, the post was just published.
            console.log('Post has been published');
            // don't reload if user clicked "republish" - it will redirect to original page
            if(!jQuery('.editor-post-publish-button__button').html()=='Republish')
                location.reload();
        }

        if(!wasSavingPost)
            wasSavingPost = isSavingPost;
        if (!wasPublishingPost)
        wasPublishingPost = isPublishingPost;
        // console.log('wasSavingPost && !isSavingPost && wasPublishingPost && !isPublishingPost', wasSavingPost, isSavingPost, wasPublishingPost,isPublishingPost);
    });

    // this reloads the page when page gets switched to draft (to renew the UI)
    wp.data.subscribe(() => {
        const isSavingPost = wp.data.select('core/editor').isSavingPost();
        const isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();
        const isEditedPostDirty = wp.data.select('core/editor').isEditedPostDirty();

        if (wasSavingPost && !isSavingPost && !isAutosavingPost && !isEditedPostDirty) {
            const postStatus = wp.data.select('core/editor').getCurrentPost().status;

            if (postStatus === 'draft') {
                // Post was being saved but is no longer being saved,
                // and it was not an autosave or there are no unsaved changes remaining.
                // Thus, the post was just switched to draft.
                location.reload();
                console.log('Post has been switched to draft');
            }
        }

        console.log('wasSavingPost && !isSavingPost && !isAutosavingPost && !isEditedPostDirty', wasSavingPost, isSavingPost, isAutosavingPost, isEditedPostDirty);
        if(!wasSavingPost)
            wasSavingPost = isSavingPost;
    });

    
    jQuery.ajax({
        url: '/wp-json/publish-to-qa/v1/get-status',
        method: 'POST',
        beforeSend: function ( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
        },
        data:{
            postId: id 
        }
    }).done( function(response) {
        
        console.log('status: ', response);

        var status = response.status;
        var postStatus = id? response.postStatus:'auto-draft';
        var isRewriteAndRepublish = response.is_rewrite_and_republish;

        // Handle response here
        if (jQuery('#publish-to-qa-button').length!=0)
            return;


        jQuery.ajax( {
            url: '/wp-json/publish-to-qa/v1/get-user-role',
            method: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data:{
                
            }
        } ).done( function ( response ) {
            // console.log('role is: ', response);
            var role = response.role;
            let buttonText = status ? 'Unpublish from QA' : 'Publish to QA';

            console.log('status response: ', response);
            
            
            

            if (status){
                // page is in QA
                if (role!='administrator') // if not admin don't let them unpublish the page
                    jQuery('.editor-post-switch-to-draft').hide();

                jQuery('.editor-post-publish-button__button').attr('style','display:inline-flex !important;'); // show publish button so user can update the page that's in QA

                // jQuery('.editor-post-publish-button').hide();

                // jQuery('.edit-post-header__settings').prepend(`<button id="qa-update" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Update</button>`);
                // jQuery('.edit-post-header__settings').prepend(`<button id="qa-request-publish" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Request Publish</button>`);

                // jQuery("#qa-request-publish").on( "click", function() {
                //     console.log('qa button click');
                //     jQuery.ajax({
                //         url:  '/wp-json/publish-to-qa/v1/qa-request-publish',
                //         method: 'POST',
                //         beforeSend: function ( xhr ) {
                //             xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                //         },
                //         data:{
                            
                //         }
                //     }).done(function(response) {
                //         // Handle response here
                    
                //         // location.reload();
                //         console.log('ajax response: ', response);
                        
                //     });
                // });
                

            }else{
                // page is not in QA
                console.log('page not in QA, role is: ', role);

                // If page is not in QA, but it's published, and we're not admin, then we can't do anything, hide everything

                if (role!='administrator' && postStatus=='publish'){
                    // jQuery('#publish-to-qa-button').hide();
                    // jQuery('.editor-post-switch-to-draft').hide();
                    
                    // hide publish button from view. NOTE: users can still publish if they enable the button through inspector
                    // jQuery('.editor-post-publish-button__button').hide();
                }
            }

            // if the post is published and not in QA, don't let anyone publish to QA - need to go through rewrite and republish for that
            console.log('debug postStatus/status/role: ', postStatus,status, role);
            if ((postStatus=='publish' && !status) || isRewriteAndRepublish){  // if it's a rewrite and republish page it's already on QA, hide publish to qa button
            }else{
                jQuery('.edit-post-header__settings').prepend(`<button id="publish-to-qa-button" type="button" class="components-button is-tertiary">${buttonText}</button>`);
            }

            if (postStatus=='publish' && status && role=='administrator'){
                // if it's in QA and it's an admin, show a "publish" button that will just make the page unrestricted
                console.log('inserting publish button..', jQuery('.interface-pinned-items').length);
                jQuery(`<button id="remove-qa-lock-button" type="button" class="components-button is-primary">Publish</button>`).insertBefore('.interface-pinned-items');
                jQuery("#remove-qa-lock-button").on( "click", function() {
                    console.log('remove qa lock button click');
    
                    // make sure we save the post first
                    wp.data.dispatch( 'core/editor' ).savePost().then(function(){
                        const url_string = window.location.href;
                        var url = new URL(url_string);
                        var id = url.searchParams.get("post")

                        jQuery.ajax({
                            url:  '/wp-json/publish-to-qa/v1/remove-lock',
                            method: 'POST',
                            beforeSend: function ( xhr ) {
                                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                            },
                            data:{
                                postId: id,
                            }
                        }).done(function(response) {
                            // Handle response here
                            // let buttonText = response.status ? 'Unpublish from QA' : 'Publish to QA';
                            // jQuery("#publish-to-qa-button").html(buttonText);
                            location.reload();
                            // console.log('remove-lock ajax response: ', response);
                        });
                    })
                })
            }

            jQuery("#publish-to-qa-button").on( "click", function() {
                console.log('qa button click');

                // make sure we save the post first
                wp.data.dispatch( 'core/editor' ).savePost().then(function(){
                    // setTimeout(function(){
                        const url_string = window.location.href;
                        var url = new URL(url_string);
                        var id = url.searchParams.get("post"); // re-get id in case this was a new page, so it would have been just assigned

                        jQuery.ajax({
                            url:  '/wp-json/publish-to-qa/v1/endpoint',
                            method: 'POST',
                            beforeSend: function ( xhr ) {
                                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
                            },
                            data:{
                                postId: id 
                            }
                        }).done(function(response) {
                            // Handle response here
                            let buttonText = response.status ? 'Unpublish from QA' : 'Publish to QA';
                            jQuery("#publish-to-qa-button").html(buttonText);
                            location.reload();
                            console.log('toggle ajax response: ', response);
                        });
                    // },5000)
                });
            });
    });
} );

   

}
//update();
waitUntilElementLoad('.edit-post-header__settings',100,update)