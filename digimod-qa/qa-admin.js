// alert('qa-admin');

jQuery(document).ready(function($) {
    var url = window.location.href;
    if (url.includes('post_status=trash')) 
        return;

    // REASSIGN EDIT LINK TO POINT TO REWRITE AND REPUBLISH
    $('tr.iedit').each(function() {
        console.log("STATUS: ", $(this).find('.post-state').text());
        if($(this).find('.post-state').text() === 'QA') {
            return true; // Continue to next iteration of loop
        }

        // Get the href of the "Rewrite & Republish" link in this div
        var rewriteHref = $(this).find('span.rewrite a').attr('href');

        // Replace the href of the "Edit" link in this div with the "Rewrite & Republish" link href
        $(this).find('span.edit a').attr('href', rewriteHref);
    });

    // REMOVE NON-REWRITE AND REPUBLISH POST ENTRIES
     // Array to hold the titles of posts being rewritten and republished
    //  var rewriteRepublishTitles = [];

    //  // Go through each post row
    //  $('tr[id^="post-"]').each(function() {
    //      // Check if the post is a 'Rewrite & Republish' post
    //      if ($(this).find('.post-state').text().includes('Rewrite & Republish of')) {
    //          // If yes, add its title to the array
    //          var title = $(this).find('.row-title').text().trim();
    //          rewriteRepublishTitles.push(title);
    //      }
    //  });

 
    //  // Go through each post row again
    //  $('tr[id^="post-"]').each(function() {
    //      // Check if the post's title is in the rewriteRepublishTitles array
    //      var title = $(this).find('.row-title').text().trim();
    //      if (rewriteRepublishTitles.includes(title)) {
    //          // If yes, check if it is NOT a 'Rewrite & Republish' post
    //          if (!$(this).find('.post-state').text().includes('Rewrite & Republish of')) {
    //              // If yes, hide it
    //              $(this).hide();
    //          }
    //      }
    //  });


    var rewriteRepublishSet = new Set();

    // Create a set of all post ids that are being rewritten and republished
    $('tr[id^="post-"]').each(function(){
        var row = $(this);
        var postState = row.find('.post-state');
        if(postState.length > 0 && postState.text().includes('Rewrite & Republish of')) {
            var anchor = row.find('.post-state a');
            // console.log('anchor: ', anchor, row);
            if (anchor.length!=0){ /// could be 0 if the original was deleted but duplicate was left - not a typical scenario
                var postId = anchor.attr('href').split('=')[1].split('&')[0];
                rewriteRepublishSet.add(postId);
            }
        }
    });

    console.log('rewriteRepublishSet: ', rewriteRepublishSet);

    // Replace "Draft, Rewrite & Republish of" status with the status of the post that it removed
    $('tr[id^="post-"]').each(function(){
        var row = $(this);
        var postState = row.find('.post-state');

        if(postState.length > 0 && postState.text().includes('Rewrite & Republish of')) {
            if(row.find('.post-state a').length==0) // might be 0 if original was deleted (not typical)
                return true;

            var postId = row.find('.post-state a').attr('href').split('=')[1].split('&')[0];
            
            var sourceRow = $('#post-' + postId);
            var sourceRowView = sourceRow.find('.view');
            console.log('sourceRow: ', sourceRow);

            if(sourceRow.length > 0) {
                let text = sourceRow.find(".post-state").text();
                row.find('[data-colname="Title"]').find('strong').html(row.find('[data-colname="Title"]').find('strong').find('a:first'));

                if (text)
                    row.find(".row-title").after(' — <span class="post-state">'+text+'</span>');

                // remove "preview" button that normally appears on review and republish post and replace it with the "view" button from original row
                row.find('.view').remove();
                row.find('.row-actions').append(sourceRowView);
                
            } 
        }
    });

    // // Remove rows that do not have "Draft, Rewrite & Republish of" status and are not in the set
    $('tr[id^="post-"]').each(function() {
        var row = $(this);
        var id = row.attr('id').split('-')[1];
        var postState = row.find('.post-state');

        if(!(postState.length > 0 && postState.text().includes('Rewrite & Republish of')) && (rewriteRepublishSet.has(id))) {
            row.remove();
        }
    });

    


     // IF POST STATUS IS  "Draft, Rewrite & Republish of..", REPLACE WITH "Published" instead
    //  $('tr[id^="post-"]').each(function() {
    //     // Check if the post is a 'Rewrite & Republish' post
    //     if ($(this).find('.post-state').text().includes('Rewrite & Republish of')) {
    //         // If yes, add its title to the array
    //         $(this).find('.post-state').html('Published');
    //         $(this).find('.post-state').first().remove();
    //     }
    // });

});