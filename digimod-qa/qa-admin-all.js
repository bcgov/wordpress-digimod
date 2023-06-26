jQuery(document).ready(function($) {
    // Remove rewrite and republish button for pages that are in QA
    // Since they are technically published
    $('tr').each(function() {
        var $row = $(this);
        if($row.find('.post-state').text() === 'QA') {
            $row.find('.rewrite').hide();
        }
    });
});