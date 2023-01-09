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
      // [ 'core/image', {} ]
      // [ 'core/image', {} ],
      ['core/paragraph', {}]
  ];

    return (
<div class="col-sm-12 col-md-3">
  <InnerBlocks template={ MY_TEMPLATE } templateLock="all"></InnerBlocks>
</div>
	);
  }