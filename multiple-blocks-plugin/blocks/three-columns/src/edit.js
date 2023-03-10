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
      ['multiple-blocks-plugin/dm-col-sm-12-md-4', {}],
      ['multiple-blocks-plugin/dm-col-sm-12-md-4', {}],
      ['multiple-blocks-plugin/dm-col-sm-12-md-4', {}]
  ];
    
    return (
<div class="row" {...blockProps}>
<InnerBlocks template={ MY_TEMPLATE } templateLock="all" />
</div>

	);
  }