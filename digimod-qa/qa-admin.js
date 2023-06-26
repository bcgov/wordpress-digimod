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
     var rewriteRepublishTitles = [];

     // Go through each post row
     $('tr[id^="post-"]').each(function() {
         // Check if the post is a 'Rewrite & Republish' post
         if ($(this).find('.post-state').text().includes('Rewrite & Republish of')) {
             // If yes, add its title to the array
             var title = $(this).find('.row-title').text().trim();
             rewriteRepublishTitles.push(title);
         }
     });

     console.log('rewriteRepublishTitles: ', rewriteRepublishTitles);
 
     // Go through each post row again
     $('tr[id^="post-"]').each(function() {
         // Check if the post's title is in the rewriteRepublishTitles array
         var title = $(this).find('.row-title').text().trim();
         console.log('title: ', title)
         if (rewriteRepublishTitles.includes(title)) {
             // If yes, check if it is NOT a 'Rewrite & Republish' post
             if (!$(this).find('.post-state').text().includes('Rewrite & Republish of')) {
                 // If yes, hide it
                 console.log('does not have Rewrite & Republish - hide')
                 $(this).hide();
             }
         }
     });
});