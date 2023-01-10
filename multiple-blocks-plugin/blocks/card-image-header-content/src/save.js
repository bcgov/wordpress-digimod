import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="row">
  <div class="card-with-image-header-content">
    <InnerBlocks.Content></InnerBlocks.Content>
  </div>
</div>
	)
  }