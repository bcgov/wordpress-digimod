import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="content-banner-wrapper contentBlockContainer container">
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }