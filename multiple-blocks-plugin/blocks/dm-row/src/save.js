import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="row">
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }