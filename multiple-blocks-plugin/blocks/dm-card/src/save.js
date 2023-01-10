import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div class="ant-card ant-card-bordered dm-card">
  <div class="ant-card-body">
    <div class="cardText">
      <div>
        <InnerBlocks.Content></InnerBlocks.Content>
      </div>
    </div>
  </div>
</div>
	)
  }