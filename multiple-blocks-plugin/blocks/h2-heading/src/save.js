import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
    <RichText.Content className="h2-heading"
    tagName="h2"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }