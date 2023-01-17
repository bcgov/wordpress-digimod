import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="col-sm-12 col-md-6">
  <div>
    
    <InnerBlocks.Content></InnerBlocks.Content>
    <RichText.Content className="content-banner-short-text"
    tagName="div"
    value={ props.attributes.content }
  ></RichText.Content>
  </div>
</div>
	)
  }