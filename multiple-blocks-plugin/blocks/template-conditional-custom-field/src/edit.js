import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks , InspectorControls } from '@wordpress/block-editor';
  import { TextControl } from "@wordpress/components";

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps({
      "className":"tccf-wrapper"
    });

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };
    
    const setFieldName = ( newContent ) => {
      setAttributes( { field_name: newContent } );
    };

    return (
      <div {...blockProps}>
          
          
          <InnerBlocks></InnerBlocks>
          <InspectorControls>
          <TextControl
            label="Field Name"
            onChange={setFieldName}
            value={attributes.field_name}
          />
        </InspectorControls>
      </div>
  	);
  }