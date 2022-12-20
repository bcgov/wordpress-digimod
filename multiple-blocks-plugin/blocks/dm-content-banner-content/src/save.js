import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="col-sm-12 col-md-6">
  <div class="sc-jOhDuK jXeQNE sideImageText">
    
    <InnerBlocks.Content></InnerBlocks.Content>
    <RichText.Content className="sc-eKBdFk hhA-dJm subTitle"
    tagName="div"
    value={ props.attributes.content }
  ></RichText.Content>
  </div>
</div>
	)
  }