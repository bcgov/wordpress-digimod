import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="col-sm-12">
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }