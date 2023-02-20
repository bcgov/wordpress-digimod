import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps({
      className:attributes.classes
    });

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };
    
    const MY_TEMPLATE = [
      ['core/paragraph', {}],
  ];

    console.log('column class: ', attributes.classes);
    return (
      <div {...blockProps}>
        <InnerBlocks  template={ MY_TEMPLATE } templateLock={false}></InnerBlocks>
      </div>
	  );
  }