import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
<div className="ant-card ant-card-bordered dm-card">
  <div className="ant-card-body">
    <div className="cardText">
      <div>
        <InnerBlocks.Content></InnerBlocks.Content>
      </div>
    </div>
  </div>
</div>
	)
  }