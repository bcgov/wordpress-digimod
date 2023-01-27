import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
    <RichText.Content className="h1-heading"
    tagName="h1"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }