import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    let extraClasses='';
    if(props['attributes']['className']){
      extraClasses = ' '+props['attributes']['className'];
    }

    return(
<div className={"row"+extraClasses}>
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	) 
  }