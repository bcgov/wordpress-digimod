import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
const { select } = wp.data;

  import { useBlockProps, useInnerBlocksProps , InnerBlocks } from '@wordpress/block-editor';

  import './editor.scss';

  export default function Edit(props) {
    const { clientId } = props;
    console.log(props);
    const blockProps = useBlockProps();
    const innerBlocksProps = useInnerBlocksProps(blockProps);
    // const onChange_content = ( newContent ) => {
    //   setAttributes( { content: newContent } );
    // };
    
    // const onChange_bannerTitle = ( newContent ) => {
      //props.setAttributes( { url: "https://youtu.be/D4DhfV7splA" } );
    // };
//     console.log(props.attributes);
// console.log(innerBlocksProps);
    const MY_TEMPLATE = [
      ['core/embed', {"url":"https://youtu.be/D4DhfV7splA","type":"video","providerNameSlug":"youtube"} ]
  ];

  // withSelect(
  //   ( select, { clientId } ) => {
  //     return {
  //       innerBlocks: select( 'core/editor' ).getBlocks( clientId )
  //     };
  //   }
  // )( ( { innerBlocks, className } ) => {
  //   console.log('inner blocks content', innerBlocks);
  // });
  const parentBlock = select( 'core/editor' ).getBlocksByClientId( clientId )[ 0 ];
  const childBlocks = parentBlock.innerBlocks;

  console.log('blocks: ', parentBlock, childBlocks);
    return (
          <InnerBlocks template={ MY_TEMPLATE } templateLock="all" />

	);
  }