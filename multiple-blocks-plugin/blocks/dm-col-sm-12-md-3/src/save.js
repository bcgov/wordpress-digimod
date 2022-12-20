import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="col-sm-12 col-md-3">
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }