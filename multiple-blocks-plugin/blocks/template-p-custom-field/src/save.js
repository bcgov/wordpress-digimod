import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
    <RichText.Content
    tagName="p"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }