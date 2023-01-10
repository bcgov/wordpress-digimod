import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="card-with-image-header-content-text">
<InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }