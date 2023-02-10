import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps();

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };

    let extraClasses='';
    if(props['attributes']['className']){
      extraClasses = ' '+props['attributes']['className'];
    }
    
    return (
<div className={"row"+extraClasses}>
  <InnerBlocks></InnerBlocks>
</div>
	);
  }