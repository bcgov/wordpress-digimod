import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
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
      <RichText className="h1-heading"
      tagName="h1"
      value={ attributes.content }
      allowedFormats={ [  ] }
      onChange={ onChange_content }
      placeholder={ 'Heading...' }
    ></RichText>
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