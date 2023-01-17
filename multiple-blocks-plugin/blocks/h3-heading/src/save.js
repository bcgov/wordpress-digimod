import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
    <RichText.Content className="h3-heading"
    tagName="h3"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }