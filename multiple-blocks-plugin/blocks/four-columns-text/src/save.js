import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    return(
  <RichText.Content className="undefined"
    tagName="div"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }