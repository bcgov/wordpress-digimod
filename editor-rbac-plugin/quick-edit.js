(function($) {
    console.log('Script is being loaded and executed');

    $(document).ready(function() {
        console.log('hello');
        var $wp_inline_edit = inlineEditPost.edit;

        inlineEditPost.edit = function(id) {
            $wp_inline_edit.apply(this, arguments);
        
            var $post_id = 0;
            if (typeof(id) == 'object') {
                $post_id = parseInt(this.getId(id));
            }
        
            if ($post_id > 0) {
                console.log('podstid ' + $post_id);
                var $edit_row = $('#edit-' + $post_id);
                var $hidden_row = '#post-'+ $post_id + ' > td.role_quick_edit.column-role_quick_edit > div';
                var allowed_roles = $($hidden_row).data('allowed_roles');
                console.log('allowed_roles ' + allowed_roles);
                $('select.allowed_roles', $edit_row).val(allowed_roles.split(','));
            }
        };
        

        // $('#bulk_edit').on('click', function() {
        //     var post_ids = [];
        //     var allowed_roles = $('#bulk-edit select[name="allowed_roles[]"]').val();

        //     $('#the-list .check-column input:checked').each(function() {
        //         post_ids.push($(this).val());
        //     });

        //     if (!post_ids.length) {
        //         return;
        //     }

        //     $.ajax({
        //         url: ajaxurl,
        //         method: 'POST',
        //         data: {
        //             nonce: $('#role_based_page_restriction_nonce').val(),
        //             post_ids: post_ids,
        //             allowed_roles: allowed_roles,
        //             action: 'quick_edit_data'
        //         },
        //         success: function(response) {
        //             console.log(response.data.message);
        //             location.reload();
        //         }
        //     });                     
        // });
        saveChangesButton.click(function() {
            var role = roleSelector.val();
        
            // Save the currently allowed pages for the selected role
            allowedPages[role] = allowedPagesList.children().map(function() {
                return $(this).data('page-id');
            }).get();
        
            // Send POST request to server
            $.ajax({
                url: 'admin-ajax.php',  // replace this with the URL of the admin AJAX endpoint
                method: 'POST',
                data: {
                    action: 'role_based_page_restriction_update_settings',
                    role: role,
                    allowed_pages: allowedPages[role],
                    _wpnonce: $('#_wpnonce').val()  // send the nonce value for security
                },
                success: function(response) {
                    console.log('Successfully saved changes:', response);
                },
                error: function(response) {
                    console.log('Failed to save changes:', response);
                }
            });
        });
        
    });
})(jQuery);