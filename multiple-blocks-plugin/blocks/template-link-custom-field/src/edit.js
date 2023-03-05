import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks , InspectorControls } from '@wordpress/block-editor';
  import { TextControl, SelectControl } from "@wordpress/components";

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
    const onChange_url = ( newContent ) => {
      setAttributes( { url: newContent } );
    };
    const onChange_linkText = ( newContent ) => {
      setAttributes( { linkText: newContent } );
    };

    return (
    <div {...blockProps}>
        <p style={{"color":"#1890ff"}}>
        <RichText 
          tagName="div"
          value={ attributes.linkText }
          allowedFormats={ [  ] }
          onChange={ onChange_linkText }
          placeholder={ 'Link text...' }
        ></RichText>

        <InspectorControls>

				<TextControl
					label="Link URL custom field"
					onChange={onChange_url}
					value={attributes.url}
				/>
        <TextControl
					label="Link text custom field"
					onChange={onChange_content}
					value={attributes.content}
				/>
        <SelectControl
						label={ 'Link Type' }
						value={ attributes.linkType }
						options={ [
							{ label: 'Internal', value: 'internal' },
							{ label: 'External', value: 'external' },
						] }
						onChange={ ( value ) => setAttributes( { linkType: value } ) }
					/>
			</InspectorControls>

				

      </p>
    </div>
  	);
  }