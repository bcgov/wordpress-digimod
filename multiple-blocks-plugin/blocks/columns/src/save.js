import {RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';


  export default function save(props) {
    
    let blockProps = useBlockProps.save({
      className:"row"
    });

    return(
      <div  {...blockProps}>
        <InnerBlocks.Content></InnerBlocks.Content>
      </div>
      
  	)
  }