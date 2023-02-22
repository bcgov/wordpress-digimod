import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    const blockProps = useBlockProps.save({
      className:props.attributes.classes
    });
    console.log('blockProps save: ', blockProps)
    return(
<div { ...blockProps }>
  <InnerBlocks.Content></InnerBlocks.Content>
</div>
	)
  }