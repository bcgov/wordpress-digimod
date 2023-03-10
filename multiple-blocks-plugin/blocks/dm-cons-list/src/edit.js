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
    
    const MY_TEMPLATE = [
      ['core/list', {"className":"consList", "ariaLabel":"cons list"}]
  ];

    return (
      <div class="col-sm-12 col-md-6">
        <InnerBlocks template={ MY_TEMPLATE } templateLock={false}></InnerBlocks>
      </div>
  	);
  }