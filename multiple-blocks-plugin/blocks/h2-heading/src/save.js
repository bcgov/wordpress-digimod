import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    console.log("PROPS: ", props);
    return(
    <RichText.Content className="sc-BeQoi sc-olbas iwFZjo iISgDu heading"
    tagName="h2"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }