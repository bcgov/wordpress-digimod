import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks , InspectorControls } from '@wordpress/block-editor';
  import { TextControl } from "@wordpress/components";

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
    
    const setFieldName = ( newContent ) => {
      setAttributes( { field_name: newContent } );
    };

    return (
      <div {...blockProps}> 
        <div class="badgeWrapper" role="list" aria-label="tags">
        <span class="customBadge" role="listitem">Some</span>
        <span class="customBadge" role="listitem">Example</span>
        <span class="customBadge" role="listitem">Tags</span>
      </div>
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