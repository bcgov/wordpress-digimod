jQuery('.row-actions').each(function(){
    jQuery(this).find('.edit').after('<span class="edit"><a href="'+jQuery(this).find('.edit a').attr('href')+'&classic-editor__forget&cite-editor=true">Edit with Digimod-CITE (experimental)</a> | </span>')
})