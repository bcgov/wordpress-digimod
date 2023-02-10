import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    // console.log('h2-heading props: ', props);
    let extraClasses='';
    if(props['attributes']['className']){
      extraClasses = ' '+props['attributes']['className'];
    }

    return(
    <RichText.Content className={"h2-heading"+extraClasses}
    tagName="h2"
    value={ props.attributes.content }
  ></RichText.Content>
  	)
  }