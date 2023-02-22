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
    
    const onChange_title = ( newContent ) => {
      setAttributes( { title: newContent } );
    };
    
    const MY_TEMPLATE = [
      // [ 'core/image', {} ]
      // [ 'core/image', {} ],
      ['multiple-blocks-plugin/dm-content-banner-content', {}],
     
      ['multiple-blocks-plugin/dm-content-banner-image', {} ]
  ];

    return (
    <div className="wp-block-group alignwide" {...blockProps}>
      <div id="main-content-anchor" className="content-banner-wrapper container">
        <div className="row middle-xs">
          <InnerBlocks template={ MY_TEMPLATE } templateLock="all" />
        </div>
      </div>
    </div>
  	);
  }