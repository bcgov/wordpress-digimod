import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div id="main-content-anchor" class="content-banner-wrapper container">
  <div class="row middle-xs">
    <InnerBlocks.Content></InnerBlocks.Content>
  </div>
</div>
	)
  }